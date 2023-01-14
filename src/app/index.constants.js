(function () {
    'use strict';

    angular
        .module('tech-diser')
        .constant("serverUrl", "app/data/")
        .constant("PARAM_NOTION",
            {
                "attributeNotion": "@",
                "paramNotion": "$",
                "selfParamNotion": ".",
                "variableContainer": "[",
                "variableContainerEnd": "]",
                "starterNotion": "/",
                "pathSpliter": "|"
            }
        )
        .constant("SERVER_URL", "app/data/")
        .constant("TKDR_PATH_SUFFIX", "TKDR_PATH_SUFFIX")
        .constant("CALLBACK_PARAM_NAME", "CALLBACK_PARAM_NAME")
        .constant('CONSTANT_DATE_FORMAT', "dd.MM.yyyy")
        .constant('CONSTANT_TIME_FORMAT', "hh:mm tt")
        .constant('CONSTANT_DATE_REGULAR_EXP', /^(\d{2})\.(\d{2})\.(\d{4})$/)
        .constant('CONSTANT_SYS_DATE_FORMAT', "yyyy-MM-dd")
        .constant('CONSTANT_SYS_TIME_FORMAT', "HH:mm:ss")
        .constant('CONSTANT_SYS_DATE_REGULAR_EXP', /^(\d{4})\-(\d{2})\-(\d{2})$/)
        .constant('CONSTANT_REFERENCE_MARKER_QTY', 1000)
        .constant("NOMINATION_TYPES", ["direct", "buyer", "organization", "development"])
        .constant('CONSTANT_DATE_TIME_FORMATS', {
            'CONSTANT_DATE_FORMAT': "dd.MM.yyyy",
            'CONSTANT_TIME_FORMAT': "hh:mm tt",
            'CONSTANT_DATE_REGULAR_EXP': /^(\d{2})\.(\d{2})\.(\d{4})$/,
            'CONSTANT_SYS_DATE_FORMAT': "yyyy-MM-dd",
            'CONSTANT_SYS_TIME_FORMAT': "HH:mm:ss",
            'CONSTANT_SYS_DATE_REGULAR_EXP': /^(\d{4})\-(\d{2})\-(\d{2})$/,
            'CONSTANT_SYS_TIME_REGULAR_EXP': /^(\d{2})\:(\d{2})\:(\d{2})$/,
            'CONSTANT_DATE_TIME_SEPARATOR': " "
        })
        .constant('CONSTANT_DATE_TIME_CONSTANTS', {
            'CONSTANT_DATE_FORMAT': "dd.MM.yyyy",
            'CONSTANT_TIME_FORMAT': "hh:mm tt",
            'CONSTANT_DATE_REGULAR_EXP': /^(\d{2})\.(\d{2})\.(\d{4})$/,
            'CONSTANT_SYS_DATE_FORMAT': "yyyy-MM-dd",
            'CONSTANT_SYS_TIME_FORMAT': "HH:mm:ss",
            'CONSTANT_SYS_DATE_REGULAR_EXP': /^(\d{4})\-(\d{2})\-(\d{2})$/,
            'CONSTANT_SYS_TIME_REGULAR_EXP': /^(\d{2})\:(\d{2})\:(\d{2})$/,
            'CONSTANT_DATE_TIME_SEPARATOR': " "
        })
        .constant('TECHDISER_PREFIX_SEPERATOR', "@")
        .constant('CONSTANT_SEPERATOR', "|")
        .constant("CONSTANT_REGISTER_COLUMN_TYPES", [
            { id: 'text', text: 'Text' },
            { id: 'select', text: 'Select' },
            { id: 'multiSelect', text: 'Multiple Select' },
            { id: 'singleObject', text: 'Object' },
            { id: 'singleObjectInline', text: 'Inline Object' },
            { id: 'multiObject', text: 'Multiple Object' },
            { id: 'multilineText', text: 'Multiline Text' },
            { id: 'numeric', text: 'Numeric' },
            { id: 'date', text: 'Date' },
            { id: 'dateTime', text: 'Date Time' },
            { id: 'trueFalse', text: 'True or False' },
            { id: 'multiCheck', text: 'Multiple Checkbox' },
            { id: 'radio', text: 'Radio' },
            { id: 'image', text: 'Image' },
            { id: 'attachment', text: 'Attachment' },
            { id: 'html', text: 'HTML' },
            { id: 'group', text: 'Column Group' },
            { id: 'register', text: 'Register' }

        ])
        .constant('CONSTANT_BOOKING_MODES', [
            { id: 'initial-booking', text: 'Initial' },
            { id: 'final-booking', text: 'Final' }
        ])
        .constant('CONSTANT_PAYMENT_INSTRUMENTS', [
            { id: 'lc', text: 'LC', "type": "credit" },
            { id: 'check', text: 'Check', "type": "debit" },
            { id: 'dd', text: 'DD', "type": "debit" },
            { id: 'tt', text: 'TT', "type": "debit" }
        ])
        .constant('CONSTANT_CURRENCIES', [
            { id: 'bdt', text: 'BDT', "fullText": "Bangladeshi Taka" },
            { id: 'usd', text: 'USD', "fullText": "United Staes Dollar" }
        ])
        .constant('CONSTANT_SEW_REQUEST_STATUS', [
            { id: 'CREATED', text: 'Request Created' },
            { id: 'SENT', text: 'Sent to Production' },
            { id: 'RECEIVED', text: 'Received at Production' },
            { id: 'CONFIRMED', text: 'Booking Confirmed' }
        ])
        .constant('CONSTANT_CONFIRMATIONS_MODES', [
            { id: 'confirmed', text: 'Confirmed' },
            { id: 'speculative', text: 'Speculative' },
            { id: 'provision', text: 'Provision' },
        ])
        .constant("CONSTANT_AGGREGATE_OPTIONS", [
            { id: 'Count', text: 'Count' },
            { id: 'Last', text: 'Newest' },
            { id: 'First', text: 'Oldest' },
            { id: 'ColumnWise', text: 'Column wise' },

        ]).constant("CONSTANT_AGGREGATE_TYPES", [
            { id: 'Average', text: 'Average' },
            { id: 'Max', text: 'Max' },
            { id: 'Min', text: 'Min' },
            { id: 'Sum', text: 'Sum' }
        ]).constant("CONSTANT_REFERENCE_GROUPS", [
            { id: 'country', text: 'country' },
            { id: 'division', text: 'division' },
            { id: 'district', text: 'district' },
            { id: 'thana', text: 'thana' }
        ]
        ).constant("comparisonOperators", [
            { id: '==', text: '==' },
            { id: '!=', text: '!=' },
            { id: '===', text: '===' },
            { id: '!==', text: '!==' },
            { id: '>', text: '>' },
            { id: '>=', text: '>=' },
            { id: '<', text: '<' },
            { id: '<=', text: '<=' },
            { id: 'in', text: 'in' },
            { id: 'not-in', text: 'not in' }
        ]
        )
        .constant("MSB_OPERATORS", {
            'GTE': function (a, b) { return a >= b },
            'LTE': function (a, b) { return a <= b }
        }
        )
        .constant("paperSizes", [
            'A4', 'LEGAL', 'LETTER'
        ]
        )
        .constant("CONSTANT_APP_MODE", "1")
        .constant("JSON_REF_STrUCTURES", [
            { "JSON_FILE": "repository/landingPage.json", "REFERENCE_OBJECT_ID": "TECHDIZER_LANDING_PAGES_123" }
        ])
        .constant("CONSTANT_SERVICE_INFO", {

            //CODE_GENERATOR_MARKER_CONSTANTS 
        })
        .constant("CONSTANT_VIEW_INFO", {
            "TNA": {
                "CODE": "10000",
                "ACTIONS": [
                    { "SAVE_TNA": "1001" }, { "LOAD_TNA": "1002" },
                    { "SAVE_PROD_DEF": "1003" }
                ],
                "FRAME_TYPES": [
                    { "TNA_CONF": "2001" }, { "TNA_SCHEMA_DEF": "2002" }, { "TNA_DATA": "2003" }
                    , { "PRODUCTION_DEF": "2004" }
                ],
            },
            "REGISTER": {
                "CODE": "20000",
                "ACTIONS": [{ "SAVE_REGISTER": "1001" }]
            }
        })
        .constant("CONSTANT_RESPONSE_TYPES", [
            "ACK",
            "REQ_CALLBACK",
            "CODE_NOT_DEF",
            "NACK"
        ])
        .constant("CONSTANT_REPORT_ON", [
            {
                "WORK_UNIT": ["activity", "task"]
            }
        ])
        .constant("PRIMARY_COLUMN_NAME", "TECHDISER_ID")
        .constant("SEARCH_PATH_PARAM", "TECHDISER_SEARCH_PATH")
        .constant("CODE_COLUMN_NAME", "TECHDISER_CODE")
        .constant("WS_FRAME_END", "TECHDISER0000FRAME")
        .constant("SOCKET_OPERATION_ERROR", "socketOperationError")
        .constant("WORKER_DATA_RECEIVED", "workerDataReceived")
        .constant("SERIAL_COLUMN_NAME", "TECHDISER_SERIAL_NO")
        .constant("WS_FRAME_START", "V000-TECHDISER-FRAME")
        .constant("DISCISION_ROOT", "root")
        .constant("SCHEDULE_MODES", ["TASKS", "TnA", "TnA_DEF"])
        .constant("NO_ACTION", ["NotRequired", "modeNotRequired"])
        .constant("DUPLICATE_ID_SEPERATOR", "$")
        .constant("CORRESPONDENCE_CARD_STATUS", {
            "generated": "Generated",
            "shared": "Shared",
            "responsed": "Feedback Received",
            "archived": "In History"
        })
        .constant("PERMISSION_DIRECTIVE_MODES", {
            "roles": "roles",
            "groups": "groups",
            "specialPermissions": "specialPermissions",
            "denyPermissions": "denyPermissions",
            "permissionSet": "permissionSet",
            "activity": "activity"
        })
        .constant("LIFECYCLE", [
            { "id": "poInqiry", "title": "Inquiry", "lcType": "|" },
            { "id": "poInitiation", "title": "Initiation", "lcType": "|" },
            { "id": "poConfirmation", "title": "PO Confirmation", "lcType": "masterLcReceive" },
            { "id": "MasterLC", "title": "Master LC", "lcType": "|" },
            { "id": "MaterialDevelopment", "title": "Material Dev", "lcType": "lcOpen" },
            { "id": "styleDevelopment", "title": "Style Dev", "lcType": "|" },
            { "id": "PreproductionApproval", "title": "Preproduction App", "lcType": "|" },
            { "id": "TrialProduction", "title": "Trial Prod", "lcType": "|" },
            { "id": "BulkProduction", "title": "Bulk Prod", "lcType": "|" },
            { "id": "FinalInspection", "title": "Inspection", "lcType": "|" },
            { "id": "XFactory", "title": "X-Factory", "lcType": "|" },
            { "id": "poPayment", "title": "Payment", "lcType": "payment" },
            { "id": "BuyersFeedback", "title": "Buyer Feedback", "lcType": "|" }
        ])
        .constant("STYLE_DETAILS_MENUES", ["Basic Info", "Garment Panels", "Operation Definition", "Style Definition",
            "Measurement", "Materials", "Consumption", "Costing", "AQL", "Style Summary",
            "Instructions", "Size Definition", "Combo Definition", "SMV"
        ])
        .constant("STYLE_FOREIGNER", ["Measurement", "Material", "Consumption"
        ])
        .constant("INQUIRY_DETAILS_MENUS", ["Basic Info", "Job Definition", "Combo", "Size Definition", "Measurement", "Material", "Consumption", "Stakeholder Selection", "Correspondence", "Inquiry Task Def",
            "Approvals", "Tests", "Assortment", "Deliverable",
            "Inspection", "Shipment & ETDs", "Inquiry Confirmation"])
        .constant("COUNTRIES", ["Australia", "Bangladesh", "China", "France", "Germany", "Hong Kong", "India",
            "Italy", "Spain", "Turkey", "UK", "USA", "Vietnam"
        ])
        .constant("PERSON_IMG_HOLDER", "assets/images/avatars/pp-holder.png")
        .constant("BLANK_IMAGE", "https://screenshotlayer.com/images/assets/placeholder.png")
        .constant("UI_CRUD", {
            "CREATE": 100000,
            "READ": 100001,
            "UPDATE": 100002,
            "DELETE": 100003
        })
        .constant("SALES_CONTACT_STATUS", {
            "UN_ATTEMPTED": 100400,
            "ATTEMPTED": 100401,
            "CONTACTED": 100402,
            "PIPE_LINED": 100403,
            "DROPPED": 100404
        })
        .constant("UNIT", {
            "MEASUREMENT_UNIT": "MeasurementUnit",
            "CONSUMPTION_UNIT": "ConsumptionUnit"
        })
        .constant("USER_STATUS", {
            "CREATED": 101000,
            "PROPOSED": 101001,
            "ACCEPTED": 101002,
            "REVOKED": 101003,
            "INACTIVE": 101005,
            "ACTIVE": 101999
        })
        .constant("TASK_STATUS", [
            { "key": "CREATED", "title": "Created", "code": 102006 },
            { "key": "APPROVAL", "title": "Approval", "code": 102006 },
            { "key": "PENDING", "title": "Pending", "code": 102000 },
            { "key": "LOPNG_PENDING", "title": "Long Pending", "code": 102000 },
            { "key": "OVER_DUE", "title": "Over Due", "code": 102001 },
            { "key": "DUE", "title": "Due", "code": 102002 },
            { "key": "IN_PROGRESS", "title": "In Progress", "code": 102003 },
            { "key": "TODO", "title": "To Do", "code": 102004 },
            { "key": "DONE", "title": "Done", "code": 102005 }
        ])
        .constant("ROLE_TITLE", [
            // {"key": "officeIncharge", "value": "Office In-charge"},
            { "key": 1, "value": "Factory/Office In-charge" },
            { "key": 2, "value": "Dept. In-charge" },
            { "key": 3, "value": "Division Head" },
            { "key": 4, "value": "Team Lead" },
            { "key": 5, "value": "Team Members" },
            { "key": 6, "value": "Unit Lead" },
            { "key": 7, "value": "Team Members" }
        ])
        .constant("NOTIFICATION_GROUPS", [
            { "key": "office", "value": "Office" },
            { "key": "factory", "value": "Factory" },
            { "key": "marketing", "value": "Marketing" },
            { "key": "store", "value": "Store" },
            { "key": "production", "value": "Production" },
            { "key": "qc", "value": "QC" }
        ])
        .constant("TASK_TYPE", [
            { "key": "INIT", "title": "Init", "code": 103000 },
            { "key": "COMPLETION", "title": "Completion", "code": 103001 },
            { "key": "APPROVAL", "title": "Approval", "code": 103002 }
        ])
        .constant("ALLOTMENT_STATUS", {
            "PROJECT_ALLOTMENT_PENDING": 401000,
            "PROJECT_ALLOTMENT_CONFIRM": 401001
        })
        .constant("GOODS_POSITION_STATUS", {
            "PENDING": 501000,
            "CONFIRM": 501001
        }).constant("BOOKING_CONFIRMATION_STATUS", {
            "INITIATED": 601000,
            "APPROVED": 602001,
            "DISAPPROVED": 603002,
            "SENT": 604003,
            "ACCEPTED": 605004,
            "REJECTED": 606005,
            "CONFIRMED": 607006,
            "IN_PROGRESS": 608007

        })
        .constant("CUTBUNDLE_STATUS", {
            "CUTBUNDLE_RECEIVED": 201050,
            "CUTBUNDLE_PENDING": 201040,
            "SEW_PENDING": 201000,
            "EMBROIDERY_PENDING": 201001,
            "PRINT_PENDING": 201002,
            "SEW_ISSUED": 201010,
            "PACKING_ISSUED": 201016,
            "EMBROIDERY_SENT": 201011,
            "PRINT_SENT": 201012,
            "WASH_SENT": 201013,
            "FINISHING_SENT": 201014,
            "EMBROIDERY_RECEIVED": 201021,
            "PRINT_RECEIVED": 201022,
            "WASH_RECEIVED": 201023,
            "FINISHING_RECEIVED": 201024,
            "FINISHING_STORE_RECEIVED": 201030,
            "SEW_RECEIVED": 201025,
            "SEW_FLOOR_RECEIVED": 201031
        })
        .constant("ROUTE_TYPES", {
            "GR": "GR",
            "RP": "RP"
        })
        .constant("BUNDLE_TYPES", {
            "CUT_BUNDLE": "cutBundle",
            "SEW_BUNDLE": "sewBundle",
            "FINISHING_BUNDLE": "finishingBundle",
            "WASH_BUNDLE": "washBundle"
        })
        .constant("BUYER_TYPES", [
            { "key": "unknown", "value": "Unknown", "rating": 0 },
            { "key": "prospective", "value": "Prospective", "rating": 1 },
            { "key": "new", "value": "New", "rating": 2 },
            { "key": "long", "value": "Long Term", "rating": 3 },
            { "key": "trusted", "value": "Trusted", "rating": 4 },
            { "key": "loyal", "value": "Loyal", "rating": 5 }
        ])
        .constant("INCLINATION", [
            { "key": "high", "value": "High" },
            { "key": "medium", "value": "Medium" },
            { "key": "low", "value": "Low" }
        ])
        .constant("AGES", [
            { "id": "baby", "title": "Baby" },
            { "id": "young", "title": "Young" },
            { "id": "adult", "title": "Adult" }
        ])
        .constant("SEX", [
            { "id": "gent", "title": "Gent" },
            { "id": "lady", "title": "Lady" }
        ])
        .constant("SUPPLY_TYPE", [
            { "key": "garmentMaterials", "value": "Garment Materials", "isGroup": false },
            { "key": "garmentMaterialsGroup", "value": "Garment Materials Group", "isGroup": true },
            { "key": "presentation", "value": "Presentation", "isGroup": false },
            { "key": "presentationGroup", "value": "Presentation Group", "isGroup": true },
            { "key": "packingMaterials", "value": "Packing Materials", "isGroup": false },
            { "key": "packingMaterialsGroup", "value": "Packing Materials Group", "isGroup": true },
            { "key": "foldingMaterials", "value": "Folding Materials", "isGroup": false },
            { "key": "foldingMaterialsGroup", "value": "Folding Materials Group", "isGroup": true },
            { "key": "packContainerGroup", "value": "Packaging Container Group", "isGroup": true },
            { "key": "packContainer", "value": "Packaging Container", "isGroup": false },
            { "key": "otherGroup", "value": "Other Group", "isGroup": false }
        ])
        .constant("SOURCING_TYPE", [
            { "key": "Fabrics", "value": "Fabrics" },
            { "key": "Trims", "value": "Trims" },
            { "key": "Accessories", "value": "Accessories" },
            { "key": "PackingMaterials", "value": "Packing Materials" },
            { "key": "FoldingMaterials", "value": "Folding Materials" },
            { "key": "PackagingContainer", "value": "Packaging Container" }
        ])
        .constant("ASSORT_TYPES", [
            { "key": "solidColor_assortSize", "value": "Solid-Color Assort-Size" },
            { "key": "solidColor_solidSize", "value": "Solid-Color Solid-Size" },
            { "key": "assortColor_solidSize", "value": "Assort-Color Solid-Size" },
            { "key": "assortColor_assortSize", "value": "Assort-Color Assort-Size" },
            { "key": "custom", "value": "Custom" }])
        .constant("INVOICE_ASSORT_TYPES", [
            { "key": "solidColor_assortSize", "value": "Solid-Color Assort-Size" },
            { "key": "solidColor_solidSize", "value": "Solid-Color Solid-Size" },
            { "key": "assortColor_solidSize", "value": "Assort-Color Solid-Size" },
            { "key": "assortColor_assortSize", "value": "Assort-Color Assort-Size" }])
        .constant("LABEL_POSITION", [
            { "key": "top", "value": "Top" },
            { "key": "bottom", "value": "Bottom" },
            { "key": "front", "value": "Front" },
            { "key": "back", "value": "Back" },
            { "key": "left", "value": "Left" },
            { "key": "right", "value": "Right" }])
        .constant("INSTRUCTION_TYPE", [
            { "key": "sewInstruction", "value": "Sew Instruction" },
            { "key": "presentationInstruction", "value": "Presentation Instruction" },
            { "key": "packingInstruction", "value": "Packing Instruction" },
            { "key": "foldingInstruction", "value": "Folding Instruction" }

        ]).constant("MEASUREMENT_UNITS_CONVERTION_DEF", {
            "centimeter": {
                "centimeter": 1,
                "inch": 0.3937007874,
                "foot": 0.032808399,
                "yard": 0.010936133,
                "meter": 0.01,
                "milimeter": 10
            },
            "inch": {
                "centimeter": 2.54,
                "inch": 1,
                "foot": 0.0833333333,
                "yard": 0.0277777778,
                "meter": 0.0254,
                "milimeter": 25.4
            },
            "foot": {
                "centimeter": 30.48,
                "inch": 12,
                "foot": 1,
                "yard": 0.3333333333,
                "meter": 0.3048,
                "milimeter": 25.4
            },
            "yard": {
                "centimeter": 91.44,
                "inch": 36,
                "foot": 3,
                "yard": 1,
                "meter": 0.9144,
                "milimeter": 914.4
            },
            "meter": {
                "centimeter": 100,
                "inch": 39.37007874,
                "foot": 3.280839895,
                "yard": 1.0936132983,
                "meter": 1,
                "milimeter": 1000
            },
            "milimeter": {
                "centimeter": 0.1,
                "inch": 0.0393700787,
                "foot": 0.0032808399,
                "yard": 0.0010936133,
                "meter": 0.001,
                "milimeter": 1
            },
            "pieces": {
                "pieces": 1,
                "hundred": 0.01,
                "thousand": 0.001,
                "dozen": 0.083333
            },
            "hundred": {
                "pieces": 100,
                "hundred": 1,
                "thousand": 10,
                "dozen": 8.3333
            },
            "thousand": {
                "pieces": 1000,
                "hundred": 10,
                "thousand": 1,
                "dozen": 83.333
            }
        })
        .constant("MEASUREMENT_CALCULATION_SECQUENCE", {
            "length": ["milimeter", "centimeter", "inch", "foot", "yard", "meter"]
        })
        .constant("MEASUREMENT_CALCULATION_TYPES", ["convertion", "area", "volume", "areaToLength"])
        .constant("MEASUREMENT_UNIT_ATTRIBUTES", ["TKDR_MEASUREMENT_UNIT_LENGTH", "TKDR_MEASUREMENT_UNIT_WIDTH", "TKDR_MEASUREMENT_UNIT", "TKDR_MEASUREMENT_HOST", "TKDR_MEASUREMENT_AREA"])
        .constant("MEASUREMENT_UNITS", [
            {
                "key": "centimeter",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "centimeter (cm)",
                "shortForm": "cm"
            },
            {
                "key": "milimeter",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "milimeter (mm)",
                "shortForm": "mm"
            },
            {
                "key": "meter",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "meter (m)",
                "shortForm": "m"
            },
            {
                "key": "kilometer",
                "dimensionType": [],
                "value": "kilometer (km)",
                "shortForm": "km"
            },
            {
                "key": "inch",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "inch (in)",
                "shortForm": "in"
            },
            {

                "key": "foot",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "foot (ft)",
                "shortForm": "ft"
            },
            {

                "key": "yard",
                "dimensionType": ["length", "width", "height", "area", "volume"],
                "value": "yard (yd)",
                "shortForm": "yd"
            },
            {
                "key": "kilogram",
                "dimensionType": ["weight"],
                "value": "kilogram (kg)",
                "shortForm": "kg"
            },
            {
                "key": "gram",
                "dimensionType": ["weight"],
                "value": "gram (gm)",
                "shortForm": "gm"
            },
            {
                "key": "milligram",
                "dimensionType": ["weight"],
                "value": "milligram (mg)",
                "shortForm": "mg"
            },
            {
                "key": "ounce",
                "dimensionType": ["weight"],
                "value": "ounce (oz)",
                "shortForm": "oz"
            },
            {
                "key": "pound",
                "dimensionType": ["weight"],
                "value": "pound (lb)",
                "shortForm": "lb"
            },
            {
                "key": "liter",
                "dimensionType": ["liquid"],
                "value": "liter (lt)",
                "shortForm": "lt"
            },
            {
                "key": "deciliter",
                "dimensionType": ["liquid"],
                "value": "deciliter (dl)",
                "shortForm": "dl"
            },
            {
                "key": "centiliter",
                "dimensionType": ["liquid"],
                "value": "centiliter(cl)",
                "shortForm": "cl"
            },
            {
                "key": "kiloliter",
                "dimensionType": ["liquid"],
                "value": "kiloliter (kl)",
                "shortForm": "kl"
            },
            {
                "key": "pieces",
                "dimensionType": ["count"],
                "value": "pieces (pcs)",
                "shortForm": "pcs"
            },
            {
                "key": "dozen",
                "dimensionType": ["count"],
                "value": "dozen (12)",
                "shortForm": "dz"
            },
            {
                "key": "hundred",
                "dimensionType": ["count"],
                "value": "hundred (100)",
                "shortForm": "in 100"
            },
            {
                "key": "thousand",
                "dimensionType": ["count"],
                "value": "thousand (1000)",
                "shortForm": "K"
            }

        ]).constant("DIMENSION_TYPE", [
            { "key": "length", "value": "Length", "dimentions": ["length"] },
            { "key": "width", "value": "Width", "dimentions": ["width"] },
            { "key": "weight", "value": "Weight", "dimentions": ["weight"] },
            { "key": "area", "value": "Area", "dimentions": ["length", "width"] },
            { "key": "volume", "value": "Volume", "dimentions": ["length", "width", "height"] },
            { "key": "liquid", "value": "Liquid", "dimentions": ["liquid"] },
            { "key": "count", "value": "Count", "dimentions": ["count"] }
        ])
        .constant("MATRIC_APPLICATIONS", ["setup", "measurement", "consumption", "order"])
        .constant("MATRIC_HANDLES", ["cuttable", "count", "thread", "others"])
        .constant("MATRIC_HANDLE_UNITS", ["item", "container", "sku"])
        .constant("MATRIC_CASES", ["summary", "quantity", "sizeDef", "containerDef", "packingCons", "foldingCons"])
        .constant("MATRIC_POLICIES", [
            {
                "key": "cuttable",
                "value": "cuttable",
                "applications": [
                    {
                        "application": "setup",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "sizeDef",
                                        "dimentionDef": "width:inch"
                                    },
                                    {
                                        "case": "containerDef",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "measurement",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "pom",
                                        "dimentionDef": "area:centimeter:centimeter"
                                    },
                                    {
                                        "case": "panel",
                                        "dimentionDef": "area:centimeter:centimeter"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "consumption",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "pom",
                                        "dimentionDef": "area:centimeter:centimeter"
                                    },
                                    {
                                        "case": "panel",
                                        "dimentionDef": "area:inch:inch"
                                    },
                                    {
                                        "case": "quickMarker",
                                        "dimentionDef": "area:foot:foot"
                                    },
                                    {
                                        "case": "productionMarker",
                                        "dimentionDef": "area:foot:foot"
                                    },
                                    {
                                        "case": "summary",
                                        "dimentionDef": "area:meter:inch"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "order",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "key": "count",
                "value": "count",
                "applications": [
                    {
                        "application": "consumption",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "count:pieces"
                                    },
                                    {
                                        "case": "summary",
                                        "dimentionDef": "count:pieces"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "order",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "count:pieces"
                                    },
                                    {
                                        "case": "summary",
                                        "dimentionDef": "count:hundred"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "key": "thread",
                "value": "Thread",
                "applications": [
                    {
                        "application": "setup",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:foot"
                                    },
                                    {
                                        "case": "hostunit",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "processStitch",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:centimeter"
                                    },
                                    {
                                        "case": "summary",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "stitchLength",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:inch"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "consumption",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:meter"
                                    },
                                    {
                                        "case": "summary",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "application": "order",
                        "handleDef": [
                            {
                                "handleUnit": "item",
                                "caseDef": [
                                    {
                                        "case": "quantity",
                                        "dimentionDef": "length:meter"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ])
        .constant("MAT_TYPES", [
            {
                "key": "fabrics",
                "value": "Fabrics",
                "consType": "cuttable",
                "matType": "fabrics"
            },
            {
                "key": "button",
                "value": "Button",
                "consType": "trims",
                "matType": "trims"
            },
            {
                "key": "zipper",
                "value": "Zipper",
                "consType": "trims",
                "matType": "trims"
            },
            {
                "key": "tags",
                "value": "Tags",
                "consType": "trims",
                "matType": "trims"
            },
            {
                "key": "labels",
                "value": "Labels",
                "consType": "trims",
                "matType": "trims"
            },
            {
                "key": "thread",
                "value": "Thread",
                "consType": "thread",
                "matType": "thread"
            }
        ])
        .constant("TRIMS", ["button", "zipper", "tags", "labels"])
        .constant("TESTING_UNITS", [
            { "key": "centimeter", "value": "Centimeter (cm)" },
            { "key": "inch", "value": "Inch" },
            { "key": "endsPerInchPickPerInch", "value": "EPI X PPI" },
            { "key": "yarnCount", "value": "Yarn Count" },
            { "key": "kilogram", "value": "Kilogram (kg)" },
            { "key": "lbs", "value": "Pound (Lbs)" },
            { "key": "tearingStrength", "value": "mN/ply (mN.m2/g)" },
            { "key": "gsm", "value": "GSM" },
            { "key": "lightFastness", "value": "Light Fastness" },
            { "key": "lightShades", "value": "Light Shades" },
            { "key": "mediumShades", "value": "Medium Shades" },
            { "key": "darkShades", "value": "Dark Shades" },
            { "key": "minutes", "value": "Minutes" },
            { "key": "ppm", "value": "ppm (parts/million)" },
            { "key": "pH", "value": "pH" },
            { "key": "temperature", "value": "°C" },
            { "key": "newton", "value": "New-ton" }
        ]).constant("AGE_GROUP", [
            { "key": "kid", "value": "Kid" },
            { "key": "teenage", "value": "Teenage" },
            { "key": "young", "value": "Young" },
            { "key": "aged", "value": "Aged" }
        ]).constant("GENDER", [
            { "key": "gent", "value": "Gent" },
            { "key": "lady", "value": "Lady" },
            { "key": "baby", "value": "Baby" },
            { "key": "others", "value": "Others" }
        ]).constant("SEASONS", [
            { "key": "spring", "value": "Spring" },
            { "key": "summer", "value": "Summer" },
            { "key": "monsoon", "value": "Monsoon" },
            { "key": "autumn", "value": "Autumn/Fall" },
            { "key": "winter", "value": "Winter" }
        ]).constant("LIFE_CYCLE_EVENTS", [
            { "key": "poInitiationDate", "value": "PO Initiation Date" },
            { "key": "poConfirmationDate", "value": "PO Confirmation Date" },
            { "key": "paymentInstrumentReceive", "value": "Payment Instrument Receive" },
            { "key": "workOrderIssueDate", "value": "Work Order Issue Date" },
            { "key": "materialEta", "value": "Material ETA" },
            { "key": "cutDate", "value": "Cut Date" },
            { "key": "productEndDate", "value": "Product End Date" },
            { "key": "inspection", "value": "Inspection" }
        ])
        .constant("DEVELOPMENT_AND_PRODUCTION", "Development & Production")
        .constant("CURRENCIES", [
            { "key": "bdTk", "value": "BDT" },
            { "key": "usDollar", "value": "US Dollar (USD)" },
            { "key": "canadianDollar", "value": "Canadian Dollar (CAD)" },
            { "key": "australianDollar", "value": "Australian Dollar (AUD)" },
            { "key": "britishPound", "value": "British Pound (GBP)" },
            { "key": "euro", "value": "Euro (EUR)" }
        ])
        .constant("CM_POLICY", [
            { "key": 1, "value": "Per Garment" },
            { "key": 12, "value": "Per Dozen" },
            { "key": 100, "value": "Per Hundred" },
            { "key": 1000, "value": "Per Thousand" }
        ])
        .constant("SPACE_UNIT", [
            { "key": "feet", "value": "Feet" },
            { "key": "metre", "value": "Metre" },
            { "key": "centimeter", "value": "Centimeter" },
            { "key": "inche", "value": "Inche" }
        ])
        .constant("INFO_TYPES", [
            { "key": "buyer", "value": "BUYER" },
            { "key": "product", "value": "PRODUCT" },
            { "key": "style", "value": "STYLE" },
            { "key": "zone", "value": "ZONE" }
        ])
        .constant("INSPECTION_TYPE", [
            { "key": "firstParty", "value": "1st Party" },
            { "key": "secondParty", "value": "2nd Party" },
            { "key": "thirdParty", "value": "3rd Party" }
        ])
        .constant("TON_TYPE", [
            { "key": 1000, "value": "Metric Ton" },
            { "key": 907.18474, "value": "Short Ton (US)" },
            { "key": 1016.04691, "value": "Long Ton (UK)" }
        ])
        .constant("BILL_POLICY", [
            { "key": "seaCNF", "value": "Sea CNF" },
            { "key": "airCNF", "value": "Air CNF" },
            { "key": "inlandTransport", "value": "Inland Transport" }
        ])
        .constant("INSPECTION_CATEGORY", [
            { "key": "aInspectionCategory", "value": "A (Ok / Accepted)" },
            { "key": "bInspectionCategory", "value": "B (Ok Work with Caution)" },
            { "key": "cInspectionCategory", "value": "C (Pending / Need Merchandiser Approval)" },
            { "key": "dInspectionCategory", "value": "D (Rejected)" }
        ])
        .constant("MAT_TEST_TYPES", [
            { "key": "spec", "value": "Spec Test", "type": "test", "matTypes": ["fabrics"] },
            { "key": "labDip", "value": "Lab Dip", "type": "test", "matTypes": ["fabrics"] },
            { "key": "feature", "value": "Feature Test", "type": "test", "matTypes": ["fabrics"] },
            { "key": "strikeOff", "value": "Strike Off", "type": "test", "matTypes": ["fabrics"] },
            { "key": "shadeApproval", "value": "Shade Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "accessoryTest", "value": "Accessory Test", "type": "test", "matTypes": ["fabrics"] },
            { "key": "accessoryApproval", "value": "Accessory Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "gradesApproval", "value": "Grades Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "strengthTest", "value": "Strength Test", "type": "test", "matTypes": ["fabrics"] },
            { "key": "shadeApproval", "value": "Shade Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "productApproval", "value": "Product Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "colorContinuityApproval", "value": "Color Cnt. Approval", "type": "approval", "matTypes": ["fabrics"] },
            { "key": "coloerFastness", "value": "Color Fastness", "type": "test", "matTypes": ["button", "zipper", "labels", "thread", "print", "embroidery"] },
            { "key": "coloerLogibity", "value": "Color Longibity", "type": "test", "matTypes": ["fabrics", "button", "zipper", "labels", "thread", "print", "embroidery"] },
            { "key": "shrinkage", "value": "Shrinkage", "type": "test", "matTypes": ["fabrics", "wash"] },
        ])
        .constant("SAVE_POLICY_SPEC",
            {
                "serviceName": "serviceName",
                "taskName": "taskName",
                "dataSavePath": "dataSavePath",
                "templatePath": "templatePath",
                "containerObject": "containerObject",
                "idGenerationPolicies": "idGenerationPolicies",
                "contextObjectId": "contextObjectId",
                "persistableData": "persistableData",
                "specDef": "specDef",
                "pathId": "pathId",
                "specType": ["idGenSpec", "fetchPrefix"],
                "backeSavePath": "backeSavePath",
                "preparedObj": "preparedObj",
                "jsonServiceName": "jsonServiceName"
            }
        )
        .constant("MAT_TYPES", [
            { "key": "fabrics", "value": "Fabrics" },
            { "key": "button", "value": "Button" },
            { "key": "zipper", "value": "Zipper" },
            { "key": "tags", "value": "Tags" },
            { "key": "labels", "value": "Labels" },
            { "key": "thread", "value": "Thread" }
        ])
        .constant("MAT_SOURCE_TYPES", [
            { "key": "available", "value": "Available", "slNo": 1 },
            { "key": "handloom", "value": "Handloom", "slNo": 2 },
            { "key": "spec", "value": "Spec Sample", "slNo": 3 },
            { "key": "pp", "value": "PP", "slNo": 4 },
            { "key": "top", "value": "TOP", "slNo": 5 },
            { "key": "bulk", "value": "Bulk", "slNo": 6 }
        ])
        .constant("AQL_LEVELS", [1.5, 2.5, 4.0, 6.5])
        .constant("SAMPLE_LEVELS", [1, 2, 3])
        .constant("INSPECTION_STATUSES", ["R1", "R2", "R3", "Full"])
        .constant("LOT_INSPECTION_ASSESSMENT", [
            { "key": "acceptAssessment", "value": "Accept" },
            { "key": "replacementAssessment", "value": "Replace" },
            { "key": "nextRoundAssessment", "value": "Next Round" }
        ])
        .constant("ROUND_INSPECTION_ASSESSMENT", [
            { "key": "acceptAssessment", "value": "Accept" },
            { "key": "rejectAssessment", "value": "Reject" },
            { "key": "pendingAssessment", "value": "Pending" }
        ])
        .constant("INSPECTION_STATES", [
            { "key": "pp", "value": "Pre-production", "range": "5% - 20%" },
            { "key": "dupro", "value": "DUPRO", "range": "20% - 50%" },
            { "key": "ps", "value": "Pre-shipment", "range": "50% - 100%" }
        ])
        .constant("PROD_STATES", [
            { "key": "0", "value": "Start", "pType": "pp" },
            { "key": "5", "value": "5%", "pType": "pp" },
            { "key": "10", "value": "10%", "pType": "pp" },
            { "key": "20", "value": "20%", "pType": "pp" },
            { "key": "30", "value": "30%", "pType": "dupro" },
            { "key": "50", "value": "50%", "pType": "dupro" },
            { "key": "80", "value": "80%", "pType": "pick" },
            { "key": "100", "value": "End", "pType": "pick" }
        ])
        .constant("WBS_ISSUES", [
            { "key": "materialInhouse", "value": "Material Inhouse" },
            { "key": "materialApproval", "value": "Material Approval" },
            { "key": "sampling", "value": "Sampling" },
            { "key": "tesing", "value": "Testing" },
            { "key": "submissions", "value": "Submissions" },
            { "key": "production", "value": "production" },
            { "key": "inspection", "value": "Inspection" },
            { "key": "shipment", "value": "Shipment" }
        ])
        .constant("DUPRO_ASSESSMENT", [
            { "key": 1, "value": "Ok" },
            { "key": 0, "value": "Not Ok" }
        ])
        .constant("QUANTITY_UNITS", [
            { "key": 'piece', "value": "Piece", "quantity": 1 },
            { "key": 'dozen', "value": "Dozen", "quantity": 12 },
            { "key": 'hundred', "value": "100 Pieces", "quantity": 100 },
            { "key": 'all', "value": "Total" },
        ])
        .constant("DUPRO_INSPECTION_SCOPE", [
            { "key": 101, "value": "Color / Size" },
            { "key": 102, "value": "Color" },
            { "key": 103, "value": "Overall" }
        ])
        .constant("DUPRO_DECISION", [
            { "key": "repair", "value": "Repair" },
            { "key": "reject", "value": "Reject" }
        ])
        .constant(
            "JOB_SOURCING_ITEMS", [
            { "key": "matDev", "value": "Material Management", "nick": "Mat", "type": "other" },
            { "key": "lc", "value": "LC", "nick": "Lc", "type": "other" },
            { "key": "sampling", "value": "Sampling", "nick": "Smp", "type": "other" },
            { "key": "testing", "value": "Testing", "nick": "Tst", "type": "other" },
            { "key": "approval", "value": "Approval", "nick": "Apv", "type": "other" },
            { "key": "nomination", "value": "Nomination", "nick": "Nom", "type": "other" },
            { "key": "knitting", "value": "Knitting", "nick": "Knt", "type": "other" },
            // prod jobs
            { "key": "cutting", "value": "Cutting", "nick": "Cut", "type": "production" },
            { "key": "printing", "value": "Printing", "nick": "Prt", "type": "production" },
            { "key": "embroidery", "value": "Embroidery", "nick": "Emb", "type": "production" },
            { "key": "sewing", "value": "Sewing", "nick": "Sew", "type": "production" },
            { "key": "washing", "value": "Washing", "nick": "Wsh", "type": "production" },
            { "key": "packing", "value": "Packing", "nick": "Pck", "type": "production" },
            { "key": "finishing", "value": "Finishing", "nick": "Fns", "type": "production" },
            //end prod jobs
            { "key": "inspection", "value": "Inspection", "nick": "Inp", "type": "other" },
            { "key": "courier", "value": "Courier", "nick": "Crr", "type": "other" },
            { "key": "shipment", "value": "Shipment", "nick": "Shp", "type": "other" }
        ]
        )
        .constant(
            "MAT_DEV_JOBS", [
            // {"key": "nominate", "value": "Nominate", "nick": "Nmt"},
            { "key": "specConf", "value": "Spec Confirm", "nick": "Spc" },
            { "key": "colorConf", "value": "Color Confirm", "nick": "Clr" },
            { "key": "proto", "value": "Proto", "nick": "Pto" },
            { "key": "top", "value": "TOP", "nick": "top" },
            { "key": "production", "value": "Production", "nick": "Prd" },
            { "key": "shipment", "value": "Shipment", "nick": "Shp" }
        ]
        )
        .constant(
            "SAMPLE_TYPES", [
            { "key": "dev", "value": "Dev. Sample", "nick": "Dsm" },
            { "key": "fit", "value": "Fit Sample", "nick": "Fit" },
            { "key": "pp", "value": "PP Sample", "nick": "Pp" },
            { "key": "sizeSet", "value": "Size Set", "nick": "ss" }
        ]
        )
        .constant(
            "CONFIRMATION_PHASE", [
            { "key": "development", "value": "Development" },
            { "key": "production", "value": "Production" },
            { "key": "shipment", "value": "Shipment" },
            { "key": "inhouse", "value": "Inhouse" }
        ]
        )
        .constant(
            "JOB_SOURCING_GROUPS", [
            { "key": "reddish", "value": "Reddish", "color": "#7c160d" },
            { "key": "olive", "value": "Olive", "color": "#808000" },
            { "key": "green", "value": "Green", "color": "#3cb44b" },
            { "key": "blue", "value": "Blue", "color": "#4363d8" },
            { "key": "magenta", "value": "Magenta", "color": "#f032e6" },
            { "key": "cyan", "value": "Cyan", "color": "#42d4f4" },
            { "key": "yellow", "value": "Yellow", "color": "#ffe119" },
            { "key": "teal", "value": "Teal", "color": "#469990" },
            { "key": "orange", "value": "Orange", "color": "#f58231" },
            { "key": "lime", "value": "Lime", "color": "#bfef45" },
        ]
        )
        .constant(
            "PRODUCTION_SAMPLES", [
            { "key": "ss", "value": "Size-set Samples", "range": "All Materials Inhouse - 10%" },
            { "key": "pp", "value": "Pre-production Samples", "range": "10% - 30%" },
            { "key": "top", "value": "TOP Samples", "range": "30% - 80%" }
        ]
        )
        .constant(
            "MAT_FETCH_TYPES", [
            "MAT_DEF",
            "QUERY_TYPE",
            "CATEGORY",
            "CATEGORY_WISE_MAT",
            "COLOR_WISE_MAT",
            "COLOR_WISE_MAT_COMBO"
        ]
        )
        .constant(
            "INSPECTION_TOOL", [
            { "key": "4Point", "value": "4Point" },
            { "key": "MajorMinor", "value": "Major Minor" },
            { "key": "itemBased", "value": "Item Based" }
        ]
        ).constant(
            "DATA_SOURCE", {
            "inquiry": "INQUIRY_MANAGEMENT",
            "po-details-enq": "PROJECT"
        }
        ).constant("MAT_SOURCE_TYPES_SUBMISSION",
            [
                {
                    key: "sampleTypeAvailable", value: "Available", slNo: 1
                },
                {
                    key: "sampleTypeGStock", value: "G_Stock", slNo: 2
                },
                {
                    key: "sampleTypeSupplierStcok", value: "Sup_Stock", slNo: 3
                },
                {
                    key: "sampleTypeNominated", value: "Nominated", slNo: 4
                },
                {
                    key: "sampleTypeProto", value: "Proto", slNo: 5
                },
                {
                    key: "sampleTypeTop", value: "TOP", slNo: 6
                },
                {
                    key: "sampleTypeShipment", value: "Shipment", slNo: 7
                },
                {
                    key: "sampleTypeBulk", value: "Bulk", slNo: 8
                },
            ]
        ).constant("TECHNIQUE_ENVIRONMENT",
            [
                {
                    key: "humadity", value: "Humadity", unit: "%"
                },
                {
                    key: "pressure", value: "pressure", unit: "atm"
                },
                {
                    key: "light", value: "Light", unit: "lux"
                },
                {
                    key: "temperature", value: "Temperature", unit: "C"
                }
            ]
        );
})();
