export default class {
    flagTopReachBottom = false;
    flagBottomReachTop = false;
    flagBottomReachBottom = false;

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

        window.addEventListener('scroll', this.entranceHandler.bind(this));
        window.addEventListener('resize', this.entranceHandler.bind(this));

        this.entranceHandler();
    }

    entranceHandler() {
        const innerHeight = window.innerHeight;
        const rect = this.el.getBoundingClientRect();

        this.adjustEdge(innerHeight, rect);
    }

    adjustEdge(innerHeight, rect) {
        const flagTopHigherThanBottom = rect.top + this.offsetTopEnterBottom <= innerHeight;
        const flagTopLowerThanBottom = rect.top + this.offsetTopLeaveBottom > innerHeight;

        const flagBottomHigherThanTop = rect.bottom + this.offsetBottomReachTop <= 0;
        const flagBottomLowerThanTop = rect.bottom + this.offsetBottomReachTop > 0;

        const flagBottomHigherThanBottom = rect.bottom + this.offsetBottomEnterBottom
                                            <= innerHeight;
        const flagBottomLowerThanBottom = rect.bottom + this.offsetBottomLeaveBottom > innerHeight;

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
}