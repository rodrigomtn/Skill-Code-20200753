const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Mensajes que respondera en dos idiomas:  ingles y español
const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome, what do you want to convert?',
            ERROR_EXTENT: 'The unit of measure is not available',
            ERROR_CONVERSION: 'The amount you want to convert cannot be made',
            HELP: 'I can help you convert values from the decimal system to the English system, try "convert 5 meters to miles"',
            CANCEL: 'Goodbye, if you need any other conversion remember that I am here to help you',
            FALLBACK: 'Im sorry, I dont understand what youre asking.',
            ERROR_HANDLER: 'Sorry, I had trouble doing what you asked. Please try again.',
            RESPUNO: 'in',
            RESPDOS: 'is equal to'
        }
    },
    es:{
        translation: {
            WELCOME_MESSAGE: 'Bienvenido, ¿que deseas convertir?',
            ERROR_EXTENT: 'La unidad de medida no se encuentra disponible.',
            ERROR_CONVERSION: 'La cantidad que desas convertir no se puede realizar.',
            HELP: 'Puedo ayudarte a convertir valores del sistema decimal al sistema ingles, prueba con "convierte 5 metros a millas"',
            CANCEL: 'Adiós, si necesitas alguna otra conversión recuerda que estoy aqui para ayudarte.',
            FALLBACK:'Perdon, no entiendo lo que preguntas.',
            ERROR_HANDLER: 'Lo siento, tuve problemas para hacer lo que me pediste. Inténtalo de nuevo.',
            RESPUNO: 'en',
            RESPDOS: 'es igual a'
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Funcion para hacder las conversiones del sistema decimal al ingles
const CustomDecimalInglesIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ConvertidorDecimalInglesIntent'
    );
  },
  handle(handlerInput) {
    //Aqui recibo las respuestas que se enviaran al usuario en base al idioma
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const error_Ex = requestAttributes.t('ERROR_EXTENT');
    const error_Con = requestAttributes.t('ERROR_CONVERSION');
    const resp_uno = requestAttributes.t('RESPUNO');
    const resp_dos = requestAttributes.t('RESPDOS');
    
    let conversion;
    let resultado;
    let respuesta;
    
    const slots = handlerInput.requestEnvelope.request.intent.slots;

    const valor = slots.valor.value;
    const unidadOrigen = slots.unidadOrigen.value;
    const unidadDestino = slots.unidadDestino.value;

    // Con este if determino si el valor que se ingresa es mayor a 0 si esta bien busca la conversion
    if(valor > 0){
        // Con estos if determino el tipo de conversion que desea realizar el usuario
        if (unidadOrigen === 'metro' || unidadOrigen === 'metros' || unidadOrigen === 'meter' || unidadOrigen === 'meters') {
            if (unidadDestino === 'pulgada' || unidadDestino === 'pulgadas' || unidadDestino === 'inch' || unidadDestino === 'inches') {
                conversion = valor * 39.37;
                resultado = conversion;
            } else if (unidadDestino === 'pie' || unidadDestino === 'pies' || unidadDestino === 'foot' || unidadDestino === 'feet') {
                conversion = valor * 3.281;
                resultado = conversion;
            } else if (unidadDestino === 'yarda' || unidadDestino === 'yardas' || unidadDestino === 'yard' || unidadDestino === 'yards') {
                conversion = valor * 1.094;
                resultado = conversion;
            } else if (unidadDestino === 'milla' || unidadDestino === 'millas' || unidadDestino === 'mile' || unidadDestino === 'miles') {
                conversion = valor * 0.0006214;
                resultado = conversion;
            }
        } 
        
        if (unidadOrigen === 'centímetro' || unidadOrigen === 'centímetros') {
            if (unidadDestino === 'pulgada' || unidadDestino === 'pulgadas' || unidadDestino === 'inch' || unidadDestino === 'inches') {
                conversion = valor * 0.3937;
                resultado = conversion;
            } else if (unidadDestino === 'pie' || unidadDestino === 'pies' || unidadDestino === 'foot' || unidadDestino === 'feet') {
                conversion = valor * 0.0328084; 
                resultado = conversion;
            } else if (unidadDestino === 'yarda' || unidadDestino === 'yardas' || unidadDestino === 'yard' || unidadDestino === 'yards') {
                conversion = valor * 0.01094;
                resultado = conversion;
            } else if (unidadDestino === 'milla' || unidadDestino === 'millas' || unidadDestino === 'mile' || unidadDestino === 'miles') {
                conversion = valor * 0.0000062137;
                resultado = conversion;
            }
        } 
        
        if (unidadOrigen === 'kilómetro' || unidadOrigen === 'kilómetros') {
            if (unidadDestino === 'pulgada' || unidadDestino === 'pulgadas' || unidadDestino === 'inch' || unidadDestino === 'inches') {
                conversion = valor * 39370.079;
                resultado = conversion;
            } else if (unidadDestino === 'pie' || unidadDestino === 'pies' || unidadDestino === 'foot' || unidadDestino === 'feet') {
                conversion = valor * 3280.84; 
                resultado = conversion;
            } else if (unidadDestino === 'yarda' || unidadDestino === 'yardas' || unidadDestino === 'yard' || unidadDestino === 'yards') {
                conversion = valor * 1093.61;
                resultado = conversion;
            } else if (unidadDestino === 'milla' || unidadDestino === 'millas' || unidadDestino === 'mile' || unidadDestino === 'miles') {
                conversion = valor * 0.621371;
                resultado = conversion;
            }
        } 
    
        if (!resultado) {
          resultado = error_Ex;
        }
        respuesta = valor + ' ' + unidadOrigen + ' ' + resp_uno + ' ' + unidadDestino + ' ' + resp_dos + ' ' +resultado + ' ' + unidadDestino;
    }else{
        respuesta = error_Con;
    }

    return handlerInput.responseBuilder
      .speak(respuesta)
      .withShouldEndSession(false)
      .getResponse();
  },
};




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakHelp = requestAttributes.t('HELP');

        return handlerInput.responseBuilder
            .speak(speakHelp)
            .reprompt(speakHelp)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakCancel = requestAttributes.t('CANCEL');
        
        return handlerInput.responseBuilder
            .speak(speakCancel)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakFallback = requestAttributes.t('FALLBACK');

        return handlerInput.responseBuilder
            .speak(speakFallback)
            .reprompt(speakFallback)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakHandler = requestAttributes.t('ERROR_HANDLER');
        
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakHandler)
            .reprompt(speakHandler)
            .getResponse();
    }
};


// FUNCIONES PARA SABER EL IDIOMA
const LoggingRequestInterceptor = {
    process(handlerInput){
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const LocalizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });
        
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function(...args){
            return LocalizationClient.t(...args);
        }
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        CustomDecimalInglesIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();