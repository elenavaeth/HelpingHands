"use strict"

import {wrapHandler} from "../utils.js";
import path from "path";
import { readFile } from "fs/promises";

// Verzeichnisnamen der Quellcode Datei ermitteln
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Controller für die Wurzeladresse des Webservices. Ermöglicht in dieser
 * Fassung den Abruf der OpenAPI-Spezifikation unter `/?openapi` sowie den
 * Abruf einer HATEOAS-Übersicht unter `/`.
 */

 export default class RootController {

     /**
      * Konstruktor. Hier werden die URL-Handler registrert.
      *
      * @param {Object} server Restify Serverinstanz
      * @param {String} prefix Gemeinsamer Prefix aller URLs
      */

     constructor(server, prefix) {
         this._openApiFile = path.normalize(path.join(__dirname, "..", "api", "openapi.yaml"));

         server.get(prefix, wrapHandler(this, this.index));
         server.get(prefix + "/openapi.yaml", wrapHandler(this, this.openApi));
     }

     /**
      * GET /:
      * Liefert eine Übersicht über die vorhandenen Collections (HATEOAS-Prinzip,
      * so dass Clients die URL-Struktur des Webservices entdecken können).
      * 
      * @param {Object} req Anfrageobjekt
      * @param {Object} res Antwortobjekt
      * @param {Object} next Nächster Handler
      */

     async index(req, res, next) {
         res.sendResult([
             {
                 _name: "hilfsanzeige",
                 query: {url: "/hilfsanzeige", method: "GET", queryParams: ["search", "titel", "beschreibung", "kategorie", "zeitraum", "standort", "nutzername"]},
                 create: {url: "/hilfsanzeige", method: "POST"},
             },
             {
                 _name: "angebot",
                 query: {url: "/angebot", method: "GET", queryParams: ["search", "titel", "standort", "ersteller", "nutzername"]},
                 create: {url: "/angebot", method: "POST"},
             }
         ]);

         next();
     }

     /**
      * GET /openapi.yaml:
      * Abruf der OpenAPI-Spezifikation
      * 
      * @param {Object} req Anfrageobjekt
      * @param {Object} res Antwortobjekt
      * @param {Object} next Nächster Handler
      */

     async openApi(req, res, next) {
         if (req.query.openapi !== undefined) {
             let filecontent = await readFile(this._openApiFile);

             res.status(200);
             res.header("content-type", "application/openapi+yaml");
             res.sendRaw(filecontent);
         } else {
             res.send();
         }

         next();
     }
     
 }
