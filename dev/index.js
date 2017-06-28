const operators = {
    '+': (num1, num2) => num1 + num2,
    '-': (num1, num2) => num1 - num2,
    '*': (num1, num2) => num1 * num2,
    '/': (num1, num2) => num1 / num2,
};

function isDecimal(val) {
    return 0 < val && val < 1;
}

function getOperator(val) {
    return isDecimal(val) ? '*' : '-';
}


export default class {
    // flagTopReachBottom = false;
    // flagBottomReachTop = false;
    // flagBottomReachBottom = false;

    offsetTopEnterBottom = 0;
    offsetTopLeaveBottom = 0;
    offsetBottomReachTop = 0;
    offsetBottomEnterBottom = 0;
    offsetBottomLeaveBottom = 0;

    onTopEnterBottom = function() {};
    onTopLeaveBottom = function() {};
    onBottomEnterTop = function() {};
    onBottomLeaveTop = function() {};
    onBottomEnterBottom = function() {};
    onBottomLeaveBottom = function() {};

    constructor(options) {
        for (const key in options) {
            this[key] = options[key];
        }

        this.entranceHandler(true);

        window.addEventListener('scroll', this.entranceHandler.bind(this));
        window.addEventListener('resize', this.entranceHandler.bind(this));
    }

    entranceHandler(isFirstTime) {
        const innerHeight = window.innerHeight;
        const rect = this.el.getBoundingClientRect();
        const transform = getComputedStyle(this.el).transform;
        const transformArr = this.parseTransform(transform);

        const rectCopy = {
            top: rect.top - (transformArr[5] || 0),
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
        };

        this.adjustEdge(innerHeight, rectCopy, isFirstTime);
    }

    computeFlag(innerHeight, rect) {
        let operator;
        const OFFSET = {
            bottomReachTop: typeof this.offsetBottomReachTop === 'function' ? this.offsetBottomReachTop() : this.offsetBottomReachTop,
            topEnterBottom: typeof this.offsetTopEnterBottom === 'function' ? this.offsetTopEnterBottom() : this.offsetTopEnterBottom,
            topLeaveBottom: typeof this.offsetTopLeaveBottom === 'function' ? this.offsetTopLeaveBottom() : this.offsetTopLeaveBottom,
            bottomEnterBottom: typeof this.offsetBottomEnterBottom === 'function' ? this.offsetBottomEnterBottom() : this.offsetBottomEnterBottom,
            bottomLeaveBottom: typeof this.offsetBottomLeaveBottom === 'function' ? this.offsetBottomLeaveBottom() : this.offsetBottomLeaveBottom,
        };

        const bottomHigherThanTop = rect.bottom + OFFSET.bottomReachTop <= 0;
        const bottomLowerThanTop = rect.bottom + OFFSET.bottomReachTop > 0;


        operator = getOperator(OFFSET.topEnterBottom);
        const topHigherThanBottom
            = rect.top <= operators[operator](innerHeight, OFFSET.topEnterBottom);


        operator = getOperator(OFFSET.topLeaveBottom);
        const topLowerThanBottom
            = rect.top > operators[operator](innerHeight, OFFSET.topLeaveBottom);


        operator = getOperator(OFFSET.bottomEnterBottom);
        const bottomHigherThanBottom
            = rect.bottom <= operators[operator](innerHeight, OFFSET.bottomEnterBottom);


        operator = getOperator(OFFSET.bottomLeaveBottom);
        const bottomLowerThanBottom
            = rect.bottom > operators[operator](innerHeight, OFFSET.bottomLeaveBottom);

        return {
            topHigherThanBottom,
            topLowerThanBottom,

            bottomHigherThanTop,
            bottomLowerThanTop,

            bottomHigherThanBottom,
            bottomLowerThanBottom,
        };
    }

    adjustEdge(innerHeight, rect, isFirstTime) {
        const flag = this.computeFlag(innerHeight, rect);

        if (isFirstTime === true) {
            if (flag.topHigherThanBottom) this.onTopEnterBottom.call(this.el);
            if (flag.topLowerThanBottom) this.onTopLeaveBottom.call(this.el);

            if (flag.bottomHigherThanTop) this.onBottomLeaveTop.call(this.el);
            if (flag.bottomLowerThanTop) this.onBottomEnterTop.call(this.el);

            if (flag.bottomHigherThanBottom) this.onBottomEnterBottom.call(this.el);
            if (flag.bottomLowerThanBottom) this.onBottomLeaveBottom.call(this.el);
        }

        // top enter bottom
        if (flag.topHigherThanBottom && !this.flagTopReachBottom) {
            this.flagTopReachBottom = true;
            this.onTopEnterBottom.call(this.el);
        }

        // top leave bottom
        if (flag.topLowerThanBottom && this.flagTopReachBottom) {
            this.flagTopReachBottom = false;
            this.onTopLeaveBottom.call(this.el);
        }

        // bottom leave top
        if (flag.bottomHigherThanTop && !this.flagBottomReachTop) {
            this.flagBottomReachTop = true;
            this.onBottomLeaveTop.call(this.el);
        }

        // bottom enter top
        if (flag.bottomLowerThanTop && this.flagBottomReachTop) {
            this.flagBottomReachTop = false;
            this.onBottomEnterTop.call(this.el);
        }

        // bottom enter bottom
        if (flag.bottomHigherThanBottom && !this.flagBottomReachBottom) {
            this.flagBottomReachBottom = true;
            this.onBottomEnterBottom.call(this.el);
        }

        // bottom leave bottom
        if (flag.bottomLowerThanBottom && this.flagBottomReachBottom) {
            this.flagBottomReachBottom = false;
            this.onBottomLeaveBottom.call(this.el);
        }
    }

    parseTransform(transform) {
        return transform
                .split(/\(|,|\)/)
                .slice(1, -1)
                .map(val => parseFloat(val));
    }
}
