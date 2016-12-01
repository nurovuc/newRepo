/*
 * hoteliers.com calendar script jQuery module
 * V 0.3.16
 */
(function($) {

    $.fn.hc_calendar = function(options) {

        var HCC = {
            options: {
                packages: false,
                engine: 'http://www.hoteliers.com/wlpEngine.php',
                dateFormat: 'dd.mm.yy',
                password: '',
                extraGetData: '',
                dynamicCorpForm: false,
                hotelID: '',
                language: 'en',
                useDatepicker: true,
                useDropdowns: false,
                //aantal dagen dat de departure aangeeft na arrival date
                defaultDays: 1,
                //fancybox
                frameWidth: 920,
                frameHeight: '100%',
                //datepicker
                datepickerOptions: {
                    arrival: {},
                    departure: {}
                },
                //numbers of nights instead of departure date
                useDepartureDatepicker: true,
                useDays: false,
                //callbacks
                doBeforeCheck: $.noop,
                doAfterCheck: $.noop,
                checkOnSubmit: true
            },
            /**
             * Submit the form and display the results in a fancybox
             * @param options
             */
            doCheckForm: function(options) {
                //clone default options and extend them
                var hc_action, checkoptions;
                options = $.extend({}, HCC.options, options);

                //get hotelID
                options.hotelID = this.getHotelID(options);

                //get engine
                options.engine = this.getEngine(options);

                //set dates
                options.arrivalDate = this.getArrivalDate();
                options.departureDate = this.getDepartureDate();

                checkoptions = options.doBeforeCheck(options);
                if (typeof(checkoptions) !== 'undefined') {
                    if (checkoptions === false) {
                        return;
                    } else {
                        $.extend(options, checkoptions);
                    }
                }

                hc_action = HCC.getHCLink(options);
                $.fancybox({
                    'type': 'iframe',
                    'width': this.options.frameWidth,
                    'height': this.options.frameHeight,
                    'href': hc_action
                });
                options.doAfterCheck(options);
            },
            doCheckCorpForm: function(corpForm) {
                var pass = corpForm.passwd.value;
                var corpEngine = 'http://www.hoteliers.com/cwlpEngine.php';

                this.doCheckForm({
                    engine: corpEngine,
                    password: pass
                });

            },
            /**
             * @param corporateFormID 
             * the css id of the corporate form
             */
            addCorporateForm: function(corporateFormID) {
                $('#' + corporateFormID).bind('submit', function() {
                    HCC.doCheckCorpForm(this);
                    return false;
                });
            },
            /**
             * add a button to show the datepicker
             * @param selector 
             * jQuery selector for button
             * @param arrDep
             * 'arrival' to show arrival datepicker
             * 'deprature' to show departure datepicker
             */
            addDatepickerShowButton: function(selector, arrDep) {
                var datepickerShowButton = $(HCC.formElement).find(selector);
                if (typeof(arrDep) == 'undefined') {
                    arrDep = 'arrival'
                }
                if (datepickerShowButton.length != 0) {
                    $(selector).click(function(event) {
                        event.preventDefault();
                        switch (arrDep) {
                            case 'arrival':
                                HCC.datepickers.arrival.datepicker('show');
                                break;
                            case 'departure' :
                                HCC.datepickers.departure.datepicker('show');
                                break;
                        }
                    });
                }
            },
            getArrivalDate: function() {
                var arrivalDate = '';
                if (HCC.options.useDatepicker) {
                    var arrivalDateObj = HCC.datepickers.arrival.datepicker('getDate');
                    arrivalDate = DateFormat.formatDate(arrivalDateObj, 'y-m-d');
                } else if (HCC.options.useDropdowns) {
                    var ad = HCC.formElement.ad.value, am = HCC.formElement.am.value;
                    arrivalDate = ad + '-' + am + '-' + DropDownFunctions.getYear(ad, am);
                }
                return arrivalDate;
            },
            getDepartureDate: function() {
                var departureDate, departureDateObj, dd, dm;
                departureDate = '';
                if (HCC.options.useDatepicker) {
                    if (HCC.options.useDepartureDatepicker) {
                        departureDateObj = HCC.datepickers.departure.datepicker('getDate');
                        departureDate = DateFormat.formatDate(departureDateObj, 'y-m-d');
                    }
                    if (HCC.options.useDays) {
                        departureDateObj = HCC.datepickers.arrival.datepicker('getDate');
                        departureDateObj.setDate(departureDateObj.getDate() + parseInt(HCC.formElement.noNights.value));
                        departureDate = DateFormat.formatDate(departureDateObj, 'y-m-d');
                    }
                } else if (HCC.options.useDropdowns) {
                    dd = HCC.formElement.dd.value;
                    dm = HCC.formElement.dm.value;
                    departureDate = '&departure=' + dd + '-' + dm + '-' + DropDownFunctions.getYear(dd, dm);
                }
                return departureDate;
            },
            getHotelID: function(options) {
                if (options.hotelID == '') {
                    if (typeof(HCC.formElement.hotelID) !== 'undefined' && HCC.formElement.hotelID) {
                        options.hotelID = HCC.formElement.hotelID.value;
                    } else {
                        if (typeof(console) !== 'undefined') {
                            console.error('no hoteID defined', ' ');
                        }
                    }
                }
                return options.hotelID;
            },
            getEngine: function(options) {
                var engine = options.engine;
                if (options.packages) {
                    if ($(HCC.formElement.engine).children('option:selected')[0].value == 'packages') {
                        engine = 'http://www.hoteliers.com/wlp1PEngine.php';
                    }
                }
                if (options.dynamicCorpForm) {
                    if (options.password == '') {
                        if (typeof(HCC.formElement.passwd) !== 'undefined' && HCC.formElement.passwd.value != '') {
                            options.password = HCC.formElement.passwd.value;
                        }
                    }
                    if (options.password != '') {
                        engine = 'http://www.hoteliers.com/cwlpEngine.php';
                    }
                }
                return engine;
            },
            getHCLink: function(options) {
                var getData = '';
                //set getData
                getData += '?ID=' + options.hotelID + '&lang=' + options.language + '&arrival=' + options.arrivalDate + '&departure=' + options.departureDate;
                //set password for corporate engine 
                if (options.password != '') {
                    getData += '&passwd=' + options.password
                }
                //set user set extra data
                if (options.extraGetData != '') {
                    getData += options.extraGetData;
                }
                //hard set language
                if (options.language != 'en' && options.language != 'nl' && options.language != 'de' && options.language != 'fr' && options.language != 'es' && options.language != 'it') {
                    options.language = 'en';
                }
                var hc_action = options.engine + getData;

                if (typeof(_gaq) !== 'undefined') {
                    _gaq.push(function() {
                        if (typeof(_gat) !== 'undefined') {
                            var pageTracker = _gat._getTrackerByName();
                            hc_action = pageTracker._getLinkerUrl(hc_action);
                        }
                    });
                }
                return hc_action;
            },
            //jQuery-ui datepicker module (for arrival and deprature inputs)
            datepickers: {},
            dropdowns: function() {
                //dropdown functions
                var DDF = {
                    dInM: function(month) {
                        var currentMonth = (HCC.curDate.getMonth() + 1);
                        var Year = HCC.curDate.getFullYear();
                        if (month < currentMonth) {
                            Year = (Year + 1);
                        }
                        if (month == 2)
                        {
                            if (Math.round(Year / 4) == Year / 4)
                            {
                                if (Math.round(Year / 100) == Year / 100)
                                {
                                    if (Math.round(Year / 400) == Year / 400)
                                        return 29;
                                    else
                                        return 28;
                                }
                                else
                                    return 29;
                            }
                            return 28;
                        }
                        else if (month == 4 || month == 6 || month == 9 || month == 11)
                        {
                            return 30;
                        }
                        return 31;
                    },
                    getNDay: function() {
                        var theMonth = HCC.formElement.am.options.selectedIndex;
                        var theDay = parseInt(HCC.formElement.ad.options.selectedIndex);
                        if (!theMonth == 0 && !theDay == 0)
                        {
                            var dInMonth = this.dInM(theMonth);
                            if (theDay > dInMonth)
                            {
                                HCC.formElement.ad.options.selectedIndex = theDay = dInMonth;
                            }
                            var newDay = theDay + 1;
                            var newMonth = theMonth;
                            if (newDay > dInMonth)
                            {
                                newDay = 1;
                                newMonth = theMonth + 1;
                                if (newMonth > 12)
                                {
                                    newMonth = 1;
                                }
                            }
                            HCC.formElement.dd.selectedIndex = newDay;
                            HCC.formElement.dm.selectedIndex = newMonth;
                        }
                    },
                    checkDDate: function() {
                        var theMonth = parseInt(HCC.formElement.dm.options.selectedIndex);
                        var theDay = parseInt(HCC.formElement.dd.options.selectedIndex);
                        var dInMonth = this.dInM(theMonth);

                        if (theDay > dInMonth)
                        {
                            HCC.formElement.dd.options.selectedIndex = theDay = dInMonth;
                        }

                    },
                    getYear: function(day, month) {
                        var year = HCC.curDate.getFullYear();

                        if (month - 1 < HCC.curDate.getMonth()) {
                            year++;
                        } else if (month - 1 == HCC.curDate.getMonth()) {
                            if (day - 1 < HCC.curDate.getDate()) {
                                year++;
                            }
                        }

                        return year;
                    }
                }
                HCC.formElement.ad.selectedIndex = HCC.curDate.getDate();
                HCC.formElement.am.selectedIndex = (HCC.curDate.getMonth() + 1);
                DDF.getNDay();


                $(HCC.formElement.ad).change(function() {
                    DDF.getNDay();
                });
                $(HCC.formElement.am).change(function() {
                    DDF.getNDay();
                });
                $(HCC.formElement.dd).change(function() {
                    DDF.checkDDate();
                });
                $(HCC.formElement.dm).change(function() {
                    DDF.checkDDate();
                });
            }

        };
        function datepickersInit(options) {
            var DP = {
                options: {},
                arrival: {},
                departure: {}
            }, updateDeparture = function() {
                //update the departuredate to arrivaldate + defaultDates
                var departureDate;
                departureDate = DP.arrival.datepicker("getDate");
                departureDate.setDate(departureDate.getDate() + HCC.options.defaultDays);
                DP.departure.datepicker('option', 'minDate', departureDate);
                DP.departure.datepicker("setDate", departureDate);
            }, defaultOptions, arrivalOptions = {}, departureDate, defaultDepartureDate, departureOptions = {}, dateLang;

            DP.options.dateFormat = HCC.options.dateFormat;
            $.extend(DP.options, options);

            dateLang = HCC.options.language;
            if (dateLang == 'en') {
                dateLang = 'en-GB';
            }
            $.datepicker.setDefaults($.datepicker.regional[ dateLang ]);


            defaultOptions = {
                arrival: {
                    minDate: HCC.curDate,
                    defaultDate: HCC.curDate,
                    onSelect: function() {
                        if (HCC.options.useDepartureDatepicker) {
                            updateDeparture();
                        }
                    }
                }
            };


            //set priority options
            $.extend(arrivalOptions, defaultOptions.arrival, DP.options, DP.options.arrival);

            //initialize datepicker with options
            DP.arrival = $(HCC.formElement.arrival).datepicker(arrivalOptions);
            DP.arrival.datepicker('setDate', arrivalOptions.defaultDate);
            //set default datepickershow buttons
            HCC.addDatepickerShowButton('.hc_datepickershow_arrival', 'arrival');

            //do the same for departure datepicker
            if (HCC.options.useDepartureDatepicker) {
                //calculate mindate & defaultdate
                departureDate = new Date(HCC.curDate.getTime());
                departureDate.setDate(departureDate.getDate() + HCC.options.defaultDays);
                defaultDepartureDate = DP.arrival.datepicker("getDate");
                defaultDepartureDate.setDate(defaultDepartureDate.getDate() + HCC.options.defaultDays);
                defaultOptions = {
                    departure: {
                        defaultDate: defaultDepartureDate,
                        minDate: departureDate
                    }
                }

                $.extend(departureOptions, DP.options, defaultOptions.departure, DP.options.departure);
                DP.departure = $(HCC.formElement.departure).datepicker(departureOptions);
                DP.departure.datepicker('setDate', departureOptions.defaultDate);
                HCC.addDatepickerShowButton('.hc_datepickershow_departure', 'departure');
            }


            return DP;
        }
        ;

        HCC.formElement = this.get(0);
        HCC.doAfterCheck = HCC.options.doAfterCheck;

        //extend options
        options = $.extend(HCC.options, options);

        HCC.curDate = new Date();

        //error if form doesn't exist'
        if ($(HCC.formElement).length == 0) {
            if (typeof(console) !== 'undefined') {
                console.error('form element not found', ' ');
            }
            return false;
        }

        //look for language input
        if (typeof(HCC.formElement.language) !== 'undefined' && HCC.formElement.language) {
            options.language = HCC.formElement.language.value;
        }

        if (options.useDatepicker) {
            //initialize datepickers
            HCC.datepickers = datepickersInit(options.datepickerOptions);
        }
        if (options.useDropdowns) {
            //initialize dropdowns
            HCC.dropdowns();
        }
        //doCheckform when submitting form or clicking element with class hc_doCheckForm
        if (HCC.options.checkOnSubmit) {
            $(HCC.formElement).bind("submit", function(event) {
                event.preventDefault();
                HCC.doCheckForm();
            });
        }
        if ($('.hc_doCheckForm').length != 0) {
            $('.hc_doCheckForm').click(function(event) {
                event.preventDefault();
                HCC.doCheckForm();
            });
        }

        return HCC;
    }



})(jQuery);

var DateFormat = {
    MONTH_NAMES: new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
    DAY_NAMES: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
    LZ: function(x) {
        var y = (x < 0 || x > 9 ? "" : "0") + x;
        return y;
    },
    // ------------------------------------------------------------------
    // formatDate (date_object, format)
    // Returns a date in the output format specified.
    // The format string uses the same abbreviations as in getDateFromFormat()
    // ------------------------------------------------------------------
    formatDate: function(date, format) {
        format = format + "";
        var result = "";
        var i_format = 0;
        var c = "";
        var token = "";
        var y = date.getYear() + "";
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
        // Convert real date parts into formatted versions
        var value = new Object();
        if (y.length < 4) {
            y = "" + (y - 0 + 1900);
        }
        value["y"] = "" + y;
        value["yy"] = y;
        //    value["yy"]=y.substring(2,4);
        value["m"] = M;
        value["mm"] = this.LZ(M);
        value["MMM"] = this.MONTH_NAMES[M - 1];
        value["NNN"] = this.MONTH_NAMES[M + 11];
        value["d"] = d;
        value["dd"] = this.LZ(d);
        value["E"] = this.DAY_NAMES[E + 7];
        value["EE"] = this.DAY_NAMES[E];
        value["H"] = H;
        value["HH"] = this.LZ(H);
        if (H == 0) {
            value["h"] = 12;
        }
        else if (H > 12) {
            value["h"] = H - 12;
        }
        else {
            value["h"] = H;
        }
        value["hh"] = this.LZ(value["h"]);
        if (H > 11) {
            value["K"] = H - 12;
        } else {
            value["K"] = H;
        }
        value["k"] = H + 1;
        value["KK"] = this.LZ(value["K"]);
        value["kk"] = this.LZ(value["k"]);
        if (H > 11) {
            value["a"] = "PM";
        }
        else {
            value["a"] = "AM";
        }
        //    value["m"]=m;
        //    value["mm"]=this.LZ(m);
        value["s"] = s;
        value["ss"] = this.LZ(s);
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result = result + value[token];
            }
            else {
                result = result + token;
            }
        }
        return result;
    },
    // ------------------------------------------------------------------
    // getDateFromFormat( date_string , format_string )
    //
    // This function takes a date string and a format string. It matches
    // If the date string matches the format string, it returns the 
    // getTime() of the date. If it does not match, it returns 0.
    // ------------------------------------------------------------------
    getDateFromFormat: function(val, format) {
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var token2 = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var ampm = "";

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yy") {
                    x = 4;
                    y = 4;
                }
                //            if (token=="yy")   {
                //                x=2;
                //                y=2;
                //            }
                if (token == "y") {
                    x = 2;
                    y = 4;
                }
                year = this._getInt(val, i_val, x, y);
                if (year == null) {
                    return 0;
                }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    }
                    else {
                        year = 2000 + (year - 0);
                    }
                }
            }
            else if (token == "MM" || token == "NNN") {
                month = 0;
                for (var i = 0; i < this.MONTH_NAMES.length; i++) {
                    var month_name = this.MONTH_NAMES[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1;
                            if (month > 12) {
                                month -= 12;
                            }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return 0;
                }
            }
            else if (token == "EE" || token == "E") {
                for (var i = 0; i < this.DAY_NAMES.length; i++) {
                    var day_name = this.DAY_NAMES[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "mm" || token == "m") {
                month = this._getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return 0;
                }
                i_val += month.length;
            }
            else if (token == "dd" || token == "d") {
                date = this._getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return 0;
                }
                i_val += date.length;
            }
            else if (token == "hh" || token == "h") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "HH" || token == "H") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "KK" || token == "K") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "kk" || token == "k") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return 0;
                }
                i_val += hh.length;
                hh--;
            }
            //        else if (token=="mm"||token=="m") {
            //            mm=this._getInt(val,i_val,token.length,2);
            //            if(mm==null||(mm<0)||(mm>59)){
            //                return 0;
            //            }
            //            i_val+=mm.length;
            //        }
            else if (token == "ss" || token == "s") {
                ss = this._getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return 0;
                }
                i_val += ss.length;
            }
            else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                }
                else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                }
                else {
                    return 0;
                }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                }
                else {
                    i_val += token.length;
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) {
            return 0;
        }
        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) {
                    return 0;
                }
            }
            else {
                if (date > 28) {
                    return 0;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return 0;
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        }
        else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        var newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate.getTime();
    },
    // ------------------------------------------------------------------
    // Utility functions for parsing in getDateFromFormat()
    // ------------------------------------------------------------------
    _isInteger: function(val) {
        var digits = "1234567890";
        for (var i = 0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i)) == -1) {
                return false;
            }
        }
        return true;
    },
    _getInt: function(str, i, minlength, maxlength) {
        for (var x = maxlength; x >= minlength; x--) {
            var token = str.substring(i, i + x);
            if (token.length < minlength) {
                return null;
            }
            if (this._isInteger(token)) {
                return token;
            }
        }
        return null;
    }

}