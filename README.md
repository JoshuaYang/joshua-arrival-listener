# ArrivalListener

adjust whether element reach / leave the edge of viewport. Also can set offset.



## **initialize**

```javascript
new ArrivalListener({
  // options
});
```



## **options**

| 参数                      | 类型         | 默认值  | 描述                                       |
| ----------------------- | ---------- | ---- | ---------------------------------------- |
| el                      | dom        | null | element need to listen to (**necessary**) |
| offsetTopEnterBottom    | number（px） | 0    | offset when element's top enter viewport's bottom |
| offsetTopLeaveBottom    | number（px） | 0    | offset when element's top leave viewport's bottom |
| offsetBottomReachTop    | number（px） | 0    | offset when element's bottom enter / leave viewport's top |
| offsetBottomEnterBottom | number（px） | 0    | offset when element's bottom enter viewport's bottom |
| offsetBottomLeaveBottom | number（px） | 0    | offset when element's bottom leave viewport's bottom |
| onTopEnterBottom        | number（px） | 0    | trigger when element's top enter viewport's bottom |
| onTopLeaveBottom        | function   | null | trigger when element's top leave viewport's bottom |
| onBottomEnterTop        | function   | null | trigger when element's bottom enter viewport's top |
| onBottomLeaveTop        | function   | null | trigger when element's bottom leave viewport's top |
| onBottomEnterBottom     | function   | null | trigger when element's bottom enter viewport's bottom |
| onBottomLeaveBottom     | function   | null | trigger when element's bottom leave viewport's bottom |