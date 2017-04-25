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
            top: rect.top - transformArr[5],
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
        };

        this.adjustEdge(innerHeight, rectCopy, isFirstTime);
    }

    adjustEdge(innerHeight, rect, isFirstTime) {
        const flagTopHigherThanBottom = rect.top + this.offsetTopEnterBottom <= innerHeight;
        const flagTopLowerThanBottom = rect.top + this.offsetTopLeaveBottom > innerHeight;

        const flagBottomHigherThanTop = rect.bottom + this.offsetBottomReachTop <= 0;
        const flagBottomLowerThanTop = rect.bottom + this.offsetBottomReachTop > 0;

        const flagBottomHigherThanBottom = rect.bottom + this.offsetBottomEnterBottom
                                            <= innerHeight;
        const flagBottomLowerThanBottom = rect.bottom + this.offsetBottomLeaveBottom
                                            > innerHeight;

        if (isFirstTime === true) {
            if (flagTopHigherThanBottom) this.onTopEnterBottom.call(this.el);
            if (flagTopLowerThanBottom) this.onTopLeaveBottom.call(this.el);

            if (flagBottomHigherThanTop) this.onBottomLeaveTop.call(this.el);
            if (flagBottomLowerThanTop) this.onBottomEnterTop.call(this.el);

            if (flagBottomHigherThanBottom) this.onBottomEnterBottom.call(this.el);
            if (flagBottomLowerThanBottom) this.onBottomLeaveBottom.call(this.el);
        }

        // top enter bottom
        if (flagTopHigherThanBottom && !this.flagTopReachBottom) {
            this.flagTopReachBottom = true;
            this.onTopEnterBottom.call(this.el);
        }

        // top leave bottom
        if (flagTopLowerThanBottom && this.flagTopReachBottom) {
            this.flagTopReachBottom = false;
            this.onTopLeaveBottom.call(this.el);
        }

        // bottom leave top
        if (flagBottomHigherThanTop && !this.flagBottomReachTop) {
            this.flagBottomReachTop = true;
            this.onBottomLeaveTop.call(this.el);
        }

        // bottom enter top
        if (flagBottomLowerThanTop && this.flagBottomReachTop) {
            this.flagBottomReachTop = false;
            this.onBottomEnterTop.call(this.el);
        }

        // bottom enter bottom
        if (flagBottomHigherThanBottom && !this.flagBottomReachBottom) {
            this.flagBottomReachBottom = true;
            this.onBottomEnterBottom.call(this.el);
        }

        // bottom leave bottom
        if (flagBottomLowerThanBottom && this.flagBottomReachBottom) {
            this.flagBottomReachBottom = false;
            this.onBottomLeaveBottom.call(this.el);
        }
    }

    parseTransform(transform) {
        // add sanity check
        return transform
                .split(/\(|,|\)/)
                .slice(1, -1)
                .map(val => parseFloat(val));
    }
}
