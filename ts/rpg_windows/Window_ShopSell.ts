//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

class Window_ShopSell extends Window_ItemList {
    
        // constructor(x, y, width, height) {
        //     super(x, y, width, height);
        // };
        
        isEnabled(item) {
            return item && item.price > 0;
        };
        
    }
    