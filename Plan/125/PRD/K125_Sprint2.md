# Sprint 2 : Finish the Stock Screener and refine the Analysis Platform

## Matrix Table
- [ ] move the vertical scroll bar inside the table and scroller only active in table body.
  - [ ] The title bar (menu + title) stays frozen at the top.
  - [ ] The column header row (# | code | price | change...) also stays frozen.
  - [ ] Only the data rows (starting from row 1) scroll downward or upward.
  - [ ] The scrollbar starts directly below the column header row.
- [ ] For the horizontal scroll bar below, the index and stock columns stay frozen at the left and only other columns can be scrolled right or left.
- [ ] The column field spacing should adjust when the user hovers over the delimiter, clicks and drags it left or right, and then releases the mouse button. However, the current behavior is when hover the delimiter and click on the delimiter and mouse up and dragging the delimiter for different spacing until another mouse clicked.  Please correct this bug.

## Analysis Platform
- [ ] The locations of all Minimized windows are evenly spaced and fixed on the Stock Screener title bar. Use the dark blue color for all the titles of minimized window.

## Stock Screener
- [ ] When the sidebar is toggled, the main content area’s flex-basis or width adjusts, giving the effect of the content being symmetrically squeezed to make more room instead of overlapping.
- [ ] Show all the fields of in Matrix Table of MatrixTableWindow instead of showing only 3 fields.
- [ ] Let MatrixTableWindow, Weekly chart window, daily chart window and Analysis Table windows are all on the parent level, there is no any children level window by removing both of the original MatrixTableWindow and AnalysisPlatformWindow outer window and header.   In order words, weekly chart window, daily chart window and analysis table window need to be detacked from AnalysisPlatformWindow. 
- [ ] Combine the kebab menu of MatrixTableWindow and AnalysisPlatformWindow together and put the combined kebab menu on the top left of Stock Screener title bar with MatrixTableWindow and AnalysisPlatformWindow context menu and their children context menu.
- [ ] The minimize icon of MatrixTableWindow will be moved to the header of Matrix Table.
- [ ] MatrixTableWindow shall have 8 direction resizes instead of only right edge reize. 
- [ ] The locations of all Minimized windows are evenly spaced and fixed on the Stock Screener title bar. Use the dark blue color for all the titles of minimized window.


## Dashboard

- [ ] target card--------
- [ ] dashboard--------back click

## Side bar
- [ ] Reset Settings on side bar
  - [ ] Move the "Reset" item to the bottom of context menu and use red color wordings because it is a dangerous action.
  - [ ] Pop up a Warning message: "Reset" will delete all contents of target list and user defined target list name will be changed back to default target list names.  And a Yes or Not check box, and a confirm button.

## Mobile and Tablet RWD usage
- [ ] For RWD usage, please add navigation arrows(or carousel arrows) on folder bar in dashboard to show arrows only on mobile, pairing them with touch/swipe events for folder scrolling.
- [ ] windows can't be moved------------
- [ ] Default stock screener windows location-------
- [ ] default Analysis platform
- [ ] back arrow ----