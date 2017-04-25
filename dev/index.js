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
        return {
            topHigherThanBottom: rect.top + this.offsetTopEnterBottom <= innerHeight,
            topLowerThanBottom: rect.top + this.offsetTopLeaveBottom > innerHeight,

            bottomHigherThanTop: rect.bottom + this.offsetBottomReachTop <= 0,
            bottomLowerThanTop: rect.bottom + this.offsetBottomReachTop > 0,

            bottomHigherThanBottom: rect.bottom + this.offsetBottomEnterBottom <= innerHeight,
            bottomLowerThanBottom: rect.bottom + this.offsetBottomLeaveBottom > innerHeight,
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
