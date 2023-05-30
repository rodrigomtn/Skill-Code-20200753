const Alexa = require('ask-sdk-core');

// Mensajes que respondera en dos idiomas:  ingles y español
const languageFacts = {
  "javascript": [
    "Es un lenguaje usado principalmente para desarrollo web",
    "Es un lenguaje dinámico",
    "Está basado en prototipos",
  ],
  "php":[
    "PHP significaba originalmente Personal Home Page",
    "PHP ahora se conoce oficialmente como 'Hypertext Preprocessor (Preprocesador de hipertexto)' y fue lanzado en el año 1995",
    "Inicialmente escrito como un conjunto de Common Gateway Interface (CGI) en “C”",
  ],
  "swift":[
    "Nació de la frustración de los desarrolladores de Apple",
    "Se volvió open source en el 2015",
    "Soporta estructuras, clases, protocolos y genéricos",
    "Es compatible con diferentes frameworks y otras librerías",
  ],
  "java":[
    "El nombre de Java puede venir de las iniciales de los nombres de sus creadores James Gosling, Arthur Van Hoff, y Andy Bechtolsheim (JAVA)",
    "El nombre de Java puede venir de las iniciales de los nombres de sus creadores James Gosling, Arthur Van Hoff, y Andy Bechtolsheim (JAVA)",
    "Siglas de JustAnother Vague Acronym",
  ],
  "python":[
    "El origen de este nombre procede de una serie británica emitida en la década de los 70 en la BBC y que tenía como protagonistas al grupo cómico Monty Python.",
    "Se usa como lenguaje oficial de Google",
    "No necesitas un compilador",
    "Tiene variantes en C y Java",
  ],
  "ruby":[
    "Ruby fue desarrollado por Yukihiro 'Matz' Matsumoto en Japón en 1995. Matz quería un lenguaje de programación que combinara la facilidad de uso de Perl con la orientación a objetos de Smalltalk",
    "Ruby es un lenguaje de programación interpretado y dinámico que se utiliza principalmente en el desarrollo web, la automatización de tareas y el análisis de datos",
    "Ruby es conocido por su sintaxis sencilla y fácil de leer, lo que lo hace popular entre los principiantes en programación",
    "Ruby tiene una sintaxis única para definir bloques de código, lo que permite a los programadores escribir código de manera más concisa y eficiente",
  ],
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola, puedo darte datos curiosos de algun lenguaje de programación, di algo como "prueba JavaScript"';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Funcion saber curisidad darle al usuario
const CustomLanguageIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CustomLanguageIntent';
    },
    handle(handlerInput) {
        const {lenguage} = handlerInput.requestEnvelope.request.intent.slots;
        let response;
        const resp = "¿Se te ofrece algo más?";
        if(lenguage && languageFacts[lenguage.value]){
            response = languageFacts[lenguage.value][Math.floor(Math.random() * languageFacts[lenguage.value].length)];
        }else{
            response = "No tengo información sobre ese lenguaje, prueba con otro";
        }
        return handlerInput.responseBuilder
            .speak(response)
            .reprompt(resp)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puedo darte datos curiosos de algun lenguaje de programación, di algo como "prueba javascript"';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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
        const speakOutput = 'Que las buenas practicas te acompañen y que tengas buen codigo!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no sé nada de eso. Inténtalo de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Sesion finalizada: ${JSON.stringify(handlerInput.requestEnvelope)}`);
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
        const speakOutput = `Acabas de activar ${intentName}`;

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
        const speakOutput = 'Lo siento, tuve problemas para hacer lo que me pediste. Inténtalo de nuevo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CustomLanguageIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();