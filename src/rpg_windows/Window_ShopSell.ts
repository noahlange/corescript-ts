import Window_ItemList from './Window_ItemList';

//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

export default class Window_ShopSell extends Window_ItemList {

    isEnabled(item: DB.Item) {
        return item && item.price > 0;
    };

}
