
Heplful articles in debugging keychain sharing:
* https://medium.com/@thomsmed/share-authentication-state-across-your-apps-app-clips-and-widgets-ios-e7e7f24e5525
* https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps
* https://swiftsenpai.com/development/getting-started-widgetkit/
* https://swiftsenpai.com/development/create-lock-screen-widget/
* https://swiftsenpai.com/development/configurable-widgets-static-options
* https://emregurses.medium.com/sharing-data-between-app-and-extension-on-ios-2ff518b2ebe7
* https://evgenii.com/blog/sharing-keychain-in-ios/

For me, it wasn't working until I defined a 'service'. However, I'm only 90% sure this was the fix because since achieveing this, upon device restart I found the same buggy behaviour I was having where the widget would get `nil` back from the keychain.

Docs on widgets: 
* https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension/