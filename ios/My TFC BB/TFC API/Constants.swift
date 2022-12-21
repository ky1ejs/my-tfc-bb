//
//  Constants.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

#if LOCALHOST_API
let TFC_API_HOST = "0.0.0.0"
let TFC_API_PORT = 3000
#elseif PRODUCTION_API
let TFC_API_HOST = "my-tfc.up.railway.app"
let TFC_API_PORT = 443
#endif
