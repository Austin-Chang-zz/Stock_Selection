# Story - 13 Stock Screener

## S13-1
*   **Move header to Side bar :**
- [ ] Delete the whole header line of Matrix.
- [ ] add Alert icon in the upper top "K125 Trading System" box.  
- [ ] Move the timer and green trading sign togather above the Dashboard of the side bar.
- [ ] Move the side bar icon to the left of 2nd header line "K125 Trading System".
- [ ] Move the "Search stocks... " placeholder right below timer and trading sign.
- [ ] move light/dark mode to the the context menu of "Settings" on the side bar.
- [ ] move My account icon functions to the context menu of "Settings" on the side bar.

*   **Analysis Platform :**
- [ ] Delete two dash line boxes beneath both of weekly chart and daily chart which just are following charts' movement.

## S13-2
### Move header line features to Side bar :
- [ ] move the side bar icon from the left of "K125 Trading System" to the right of trading/Closed placeholder.
- [ ] Can delelete the entire row of header line of Dashboard because all features had been moved to side bar already. Delete this header line for all webpages.

### Adjust the field length in Dashboard :
- [ ] Add delimiters between list fields on matrix in Dashboard, show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
- [ ] Add delimiters between list fields on "Chart Analysis Table", show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
- [ ] Delete the collapse/expand button on the right of folder bar of dashboard, because it is useless.

### Set up a Stock Screener :
- [ ] Create a **StockScreener** when click the Main Matrix or any Target lists of the side bar.
- [ ] **StockScreener** includes three portions: Matrix list, Chart Analysis Table and TradingView Charts. Each of these portion shall be designed as movable objects which can be moved and resized to any location of **StockScreener** canvas.
- [ ] The default location of matrix list is located on the most left (from top to bottom) of **StockScreener** canvas. The right edge of matrix list could be dragged left or right to show up user's wanted fields.
- [ ] The default location of "Chart Analysis Table" is located on the top of **StockScreener** canvas, the left edge of table is on the right of the right edge of matrix list. 
- [ ] Other features of "Chart Analysis Table" will be same as in Analysis platform, field can be moved to left and right and table has a collapse/expend button.
- [ ] The default locations of two TradingView Charts are below the bottom edge of "Chart Analysis Table".  These weekly and daily charts and horizotally aligned.
- [ ] Other features of TradingView Chart are the same as in Analysis platform, each chart has stock title and chart can be resized and minimized.
- [ ] The data of "Chart Analysis Table" and TradingView chart will be changed according to user stock selection in Main matrix of target list.


## S13-3
### Move header line features to Side bar :
- [ ] Can delelete the entire row of header line of Dashboard because all features had been moved to side bar already. Delete this header line for all webpages.
  - [ ] Test Result : not working.
- [ ] move the side bar icon to the left of Timer.

### Adjust the field length in Dashboard :
- [ ] Add delimiters between list fields on matrix in Dashboard, show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
  - [ ] Test Result: not working.
- [ ] Add delimiters between list fields on "Chart Analysis Table", show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
  - [ ] Test Result : not working.
- [ ] Delete the collapse/expand button on the right of folder bar of dashboard, because it is useless.
  - [ ] Test Result : not working.

### Set up a Stock Screener :
- [ ] Test Result: Can't see StockScreener page or canvas.

## S13-4
### Move header line features to Side bar :
- [ ] Can delelete the entire row of header line of Dashboard because all features had been moved to side bar already. Delete this header line for all webpages.
  - [ ] Test Result : still not working. Please just delete this header line.
- [ ] move the "side bar icon/timer/trading status" block above the "searching stock" place holder. All three items share the horizontal space so that left padding, gaps between items, and right padding are equal (Evenly Spaced).
- [ ] The space between side bar icon and kebab menu on folder bar of dashboard is too large, please make this space smaller.

### Adjust the field length in Dashboard :
- [ ] Add delimiters between list fields on matrix in Dashboard, show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
  - [ ] Test Result: not working.
- [ ] Add delimiters between list fields on "Chart Analysis Table", show up horizontal resize pointer when hover on the delimiter and then can resize the field length larger or smaller by moving the resize pointer right or left direction.
  - [ ] Test Result : not working.

### Set up a Stock Screener :
- [ ] Create a **StockScreener** when click the Main Matrix or any Target lists of the side bar.
  - [ ] Test Result : not working
- [ ] **StockScreener** includes three portions: Matrix list, Chart Analysis Table and TradingView Charts. Each of these portion shall be designed as movable objects which can be moved and resized to any location of **StockScreener** canvas.
  - [ ] Test Result : not working.

## S13-5
- [ ] Please delelete the entire row of header line of Dashboard because all features had been moved to side bar already. Delete this header line for all webpages.
  - [ ] Test Result : still not working. Please just delete this header line.
- [ ] Add a side bar icon on the left of folder bar of dashboard.
- [ ] please make evenly spaced for "side bar icon/timer/trading status" block.
- [ ] please add a side bar icon on the left of title of **StockScreener** page.
- [ ] make all objects of **StockScreener** page movable.

## S13-6
- [ ] icon/timer/trading status block are overlapping the app name block.  The status block shall be below the app name block and make it evenly spaced.
- [ ] Re-design the **StockScreener** page, give up the movable feature. make all blocks fixed instead of movable.
- [ ] The **StockScreener** page has only left part and right part.  The right part is just the same as Analysis platform. The left part is the same as the matrix list of dashboard.  
- [ ] The data of right side Analysis platform will be changed according to user stock selection in matrix list.
- [ ] Recover the close icon on the top right of StockScreener page. and add a side bar icon on the top left of StockScreener page.

## S13-7
### Side Bar :
- [ ] Delete the "side bar icon" on the side bar header and recover the preious blue stock arrow symbol on the left of "K125" and "Trading System" (smaller wordings)
- [ ] add "side bar icon" on the left of icon/timer/trading status block.

### Stock Screener
- [ ] The **StockScreener** page has only left part and right parts.  
- [ ] Make the "Analysis Platform" to be an "AnalysisPlatformWindow" which is a floating window and its all contents are the same as "Analysis Platform". And put this "AnalysisPlatformWindow" to the right part of Stock Screener page.
- [ ] Make the "MatrixTable" of dashboard to be an "MatrixTableWindow" which is a floating window and its all contents are the same as "Matrix Table". And put this "MatrixTableWindow" to the left part of Stock Screener page.
- [ ] The data of right side "AnalysisPlatformWindow" will be changed according to user stock selection in matrix list of "MatrixTableWindow".
- [ ] Both of "AnalysisPlatformWindow" and "MatrixTableWindow" windows can be resized and minimized.
- [ ] Add a Stock Screener header. The header title is "Main 100 Stock Screener".  The "Main 100" is a variable which will be changed by use's selection including any list of target list on the side bar.
- [ ] Add a side bar icon on the top left of Stock Screener header. 
 
## S13-8
### Side Bar :
- [ ] please make 3 items of side bar header evenly spaced.


### Stock Screener
- [ ] The stock screener page still show the "Analysis Platform" instead of "AnalysisPlatformWindow" and "MatrixTableWindow" windows.

### Repeat the Stock Screener page requiements as follows:

- [ ] The **StockScreener** page has only left part and right parts.  
- [ ] Make the "Analysis Platform" to be an "AnalysisPlatformWindow" which is a floating window and its all contents are the same as "Analysis Platform". And put this "AnalysisPlatformWindow" to the right part of Stock Screener page.
- [ ] Make the "MatrixTable" of dashboard to be an "MatrixTableWindow" which is a floating window and its all contents are the same as "Matrix Table". And put this "MatrixTableWindow" to the left part of Stock Screener page.
- [ ] The data of right side "AnalysisPlatformWindow" will be changed according to user stock selection in matrix list of "MatrixTableWindow".
- [ ] Both of "AnalysisPlatformWindow" and "MatrixTableWindow" windows can be resized and minimized.
- [ ] Add a Stock Screener header. The header title is "Main 100 Stock Screener".  The "Main 100" is a variable which will be changed by use's selection including any list of target list on the side bar.
- [ ] Add a side bar icon on the top left of Stock Screener header. 

## S13-9
### Dashboard Matrix Table
- [ ] please shorten the default field width of index and stock number in MatrixTable.
- [ ] Move the kebab menu from the right of Matrix table header to the most left of header.
- [ ] The scroll bar in Dashboard shall be moved inside the MatrixTable and the top of scroll bar shall start at first stock row of the table, in other words, shall be right below the field row.
- [ ] Add a horizontal scroll bar at the bottom of Matrix Table in order to see more fields added in the future.

### Analysis Platform
- [ ] Add top left, top right and bottom left resize capabilities for both TradingView Charts instead of only current bottom right resize feature.
- [ ] Make the "Chart Analysis Table" to be floating window which could be resized and minimized.  The title name "Chart Analysis Table" Change to "2330 TSMC Analysis Table".  The "2330 TSMC" is the variable which will be changed according user's stock selection.

### Stock Screener
- [ ] The side bar icon on the top left of header shall have show/hide side bar capability instead of only a side bar icon image.
- [ ] Make the upper and lower paddings of header smaller in order to save more space for other activiies.
- [ ] Add the MatrixTableWindow right edge resize capabilities which can drag the table more wider or narrow.
- [ ] The default fields of MatrixTableWindow only have index number, code and any other field, in other words, only show 3 default fields for saving canvas space.
- [ ] The weekly and daily TradingView charts are sticked with "AnalysisPlatformWindow". When the TradingView charts move to left or right,  "AnalysisPlatformWindow" just follow to left or right.  Please make these weekly and daily TradingView charts are independent from "AnalysisPlatformWindow".

### ----- End of 3rd Month 2025/11/30 -----


### Todo list
delete the matrix and analysis table title names later
test other list when side bar icon working.



