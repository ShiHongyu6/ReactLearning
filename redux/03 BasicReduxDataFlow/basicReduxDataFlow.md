>This shows the complete Redux data flow cycle:
>- Our posts list read the initial set of posts from the store with useSelector and rendered the initial UI
>- We dispatched the postAdded action containing the data for the new post entry
>- The posts reducer saw the postAdded action, and updated the posts array with the new entry
>- The Redux store told the UI that some data had changed
>- The posts list read the updated posts array, and re-rendered itself to show the new post