## Story 12 - Analysis Platform

S2-0
- [ ] There is a box which will be shown when click the stock item of any dashboard matrix. I will temporary offer a "Analysis Platform" name for it, you also can give me other better name.
  - [ ] Please make this box be full screen by default.
  - [ ] Add a "Chart Analysis Table" box right below header line.
    - [ ] The Chart Analysis Table is listed as follows (at the bottom of this request due format compatible)
    - [ ] This table presents data in a matrix format with both main (upper) and sub (lower) column headers for each field except "SAR dot count." The matrix includes two data rows: one for weekly values and one for daily values. This layout enables direct comparison of metrics across weekly and daily periods, with each cell corresponding to the intersection of its respective row (period) and column (indicator). The matrix structure allows for easy side-by-side analysis of various calculated fields.
    - [ ] use the mock data in the contents of this table for developing the layout usage only. The upper left field is the Kostolany Egg phase.
  
  - [ ] Originally, there is a TradingView Chart widget at the bottom, Please make two TradingView Chart Widgets with the same size by default.
  - [ ] If the "Daily" tab of left widget is chosen, then, the "Weekly" tab of right widget is selected automatically.  Or vise versa.
  - [ ] Make both bottom widgets are floating Windows which can be minimized, resized, closed and snap to edges.
  - [ ] The boundary of these two floating windows is the full canvas of "Analysis Platform" except of header line and Chart Analysis Table.
  - [ ] Use the mock data to plot the TradingView Chart for layout verification.


  | B1     | W26 D132 | W10 D50 | W2 D10 | W2 x W10 D10 x D50 | W2xW26 D10xD132 | W10xW26 D50xD132 | SAR dot count | W2 pvcnt D2 pvcnt |
  | ------ | -------- | ------- | ------ | ------------------ | --------------- | ---------------- | ------------- | ----------------- |
  | Weekly |          |         |        |                    |                 |                  |               |                   |
  | Daily  |          |         |        |                    |                 |                  |               |                   |
---

S2-1
- [ ] Please delete the original box (or Canvas), otherwise, the boxes are duplicated.
- [ ] There are two headers and two close icons in Anlysis Platform. Delete the inner one (symbol: 2330) and keep the outer one which is the box with Analysis Platform title. But let the "Analysis Platform" wordings change to be "2330 TSMC". I don't need to show the box name or title.
- [ ] The "Chart Analysis table" presents data in a matrix format with both main (upper) and sub (lower) column headers for each field except "SAR dot count." Please align the upper and lower headers vertically instead of using "/" to seperate them.
- [ ] The "Chart Analysis table" matrix includes two data rows: one for weekly values and one for daily values. Please make one row name as Weekly and the other row name as Daily instead of using only one "period" row name.  Besides, don't separate each field to "W" and "D" two column data.
- [ ] The mock data of (W26 D132),(W10 D50),(W2 D10) are moving average value, please add upstream or downstream symbol as bullish or bearish indicators and red color for upstream value like +55↑ and green color for downstream value like -88↓.
- [ ] The mock data of (W2 x W10 D10 x D50), (W2xW26 D10xD132),(W10xW26 D50xD132) are cross count number, if cross over , like +5 (red) or cross under -3 (green).
- [ ] The mock data of (SAR dot count) and (W2 pvcnt D2 pvcnt) like +3(red) or -5 (green) as well.
- [ ] Cancell the folder of each Tradeview widget, The left widget fixed to be weekly and right widget for daily. And the title of left widget change to be "Weekly - 2330 TSMC" as example and the title of right widget change to be "Daily - 2330 TSMC".
- [ ] please put both minimized widgets on the bottom left corner of the canvas, otherwise, the minimized widget may be hide behind the open widget and can't find and open it. The title of minimized widget will the same as when it is opened.
- [ ] The upper and bottom padding of "Chart Analysis Table" are too large, please make it smaller for manipulation of chart widgets.
- [ ] Add a collapse/expand button in the most right of title of "Chart Analysis Table" for saving the space to TradingView widget.
- [ ] Please leave the margin between bottom "Chart Analysis Table" and upper Chart widget only 1 or 2 pixel for manipulation of chart widgets.
- [ ] The chart widgets could have snap top, bottom, left and right 4 directions to edges capabilities.

S2-2

- [ ] The title of "Analysis Platform" shall be stock code + stock name, like "2330 TSMC".  But the current title is "2317 Stock", all stock shows this way instead of "2330 TSMC" correct. In other words, both "stock code stock name" are variable.
 
- [ ] Delete all the TradingView Widget close function and leave the minimize and resize functions.
- [ ] please put left minimized widgets on the bottom left corner of the canvas, and put right minimized widgets on the bottom right corner of the canvas to avoid overlapping of minimized widgets.

- [ ] Add kebab menu on the most left of title bar. Click the left key on it can get context menu.  That context menu includes "Save Analysis Table", “Save Chart Location", "Save all" that means save any change of canvas including Chart and table.

S2-3
- [ ] Move (Drag & Drop) any field of "Chart Analyis Table" to left or right which make the table field according to user's favorite order. 
  - [ ] Test Result : not working.
- [ ] On the right top corner of "Analysis Platform", there are two "xx" close buttons, please cancel one close button.
  - [ ] Test Result : not woring.
- [ ] The default upper edges of two TradingView widgets are overlapping with the bottom of "Chart Analysis Table".
  - [ ] Test Result : improved, but need to move 5 pixels lower.
- [ ] When click collapse/expand button of "Chart Analysis Table" the top edge of TradingView widget shall be collapsed or expanded according with "Chart Analysis Table".
- [ ] Align the "Weekly" and "Daily" wordings in the center of field in "Chart Analysis Table".

S2-4
- [ ] The title of "Analysis Platform" shall be stock code + stock name, like "2330 TSMC".  But the current title is "2317 Stock", all stock shows this way instead of "2330 TSMC" correct. In other words, both "stock code stock name" are variable.
- [ ] Add an "Analysis Table Default" on kebab menu for reset the sequence of fields.
- [ ] "Save Chart Location" does not work.

S2-4
- [ ] "Save Chart Location" does not been saved after resizing the chart location or size.
- [ ] When click collapse/expand button of "Chart Analysis Table" the top edge of TradingView widget shall be moved up/down to the bottom edge of table. The top edges of both Charts shall be moved up or down according Table's collapse/expand.
- [ ] Just "SAR dot count" field can not been moved right or left, but all other fields movement are OK.

S2-5
- [ ] The title of "Analysis Platform" shall be stock code + stock name, like "2330 TSMC".  But the current title is "2317 Stock" or "2317 2317", some stock shows these ways instead of "2330 TSMC" correct. In other words, both "stock code stock name" are variable. 
  - [ ] Test Issue: some stock working, but some are not working.  But not working for all stocks of dashboard folders.
  
- [ ] When click collapse/expand button of "Chart Analysis Table" the top edge of TradingView widget shall be moved up/down to the bottom edge of table. The top edges of both Charts shall be moved up or down according Table's collapse/expand.
  - [ ] Test Result: not working.
 
S2-6
- [ ] Add a "Chart Default Location" on kebab menu which can reset the chart default location.
- [ ] Treat background or canvas of both weekly and daily chart as an independent "Box".  When click collapse/expand button of "Chart Analysis Table" the top edge of "Box" of TradingView widgets shall be moved up/down to the bottom edge of table. The top edges of "Box" of both Charts shall be moved up or down according Table's collapse/expand. The “Box" shall be synchronizes with table collapse/expand instead of charts.

S2-7
- [ ] Add a "Chart Default Location" on kebab menu which can reset the chart default location.
  - [ ] Test Result : not working.
- [ ] Treat background or canvas of both weekly and daily chart as an independent "Box".  In other words, the weekly and daily charts are sticker on "Box". When click collapse/expand button of "Chart Analysis Table" the top edge of "Box" shall be moved up/down to the bottom edge of table. The top edges of "Box" of both Charts shall be moved up or down according to Table's collapse/expand. The “Box" shall be synchronizes with table collapse/expand instead of sticked charts.
  - [ ] Test Result:　Not working.
- [ ] Change the order of kebab menu as follows : Save Analysis Table, Analysis Table Default, Save Chart Location, Chart Default Location, Save All.

