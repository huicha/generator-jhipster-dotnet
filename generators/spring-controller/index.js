/* eslint-disable consistent-return */
const _ = require('lodash');
const chalk = require('chalk');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const constants = require('generator-jhipster/generators/generator-constants');
const statistics = require('generator-jhipster/generators/statistics');
const prompts = require('./prompts');

const SERVER_MAIN_SRC_DIR = `${constants.MAIN_DIR}dotnet/`;
const SERVER_TEST_SRC_DIR = `${constants.TEST_DIR}dotnet/`;

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts));
        this.argument('name', { type: String, required: true });
        this.name = this.options.name;

        // This adds support for a `--from-cli` flag
        this.option('from-cli', {
            desc: 'Indicates the command is run from JHipster CLI',
            type: Boolean,
            defaults: false
        });
        this.option('default', {
            type: Boolean,
            default: false,
            description: 'default option'
        });
        this.defaultOption = this.options.default;
    }

    // Public API method used by the getter and also by Blueprints
    _initializing() {
        return {
            validateFromCli() {
                this.checkInvocationFromCLI();
            },

            initializing() {
                this.log(`The spring-controller ${this.name} is being created.`);
                const configuration = this.getAllJhipsterConfig(this, true);
                const blueprintConfiguration = this.getJhipsterAppConfig('generator-jhipster-dotnet');
                this.baseName = blueprintConfiguration.baseName || configuration.get('baseName');
                this.packageName = blueprintConfiguration.packageName || configuration.get('packageName');
                this.packageFolder = blueprintConfiguration.packageFolder || configuration.get('packageFolder');
                this.databaseType = blueprintConfiguration.databaseType || configuration.get('databaseType');
                this.reactiveController = false;
                this.applicationType = blueprintConfiguration.applicationType || configuration.get('applicationType');
                this.reactive = blueprintConfiguration.reactive || configuration.get('reactive');
                this.reactiveController = this.reactive;
                this.controllerActions = [];
            }
        };
    }

    get initializing() {
        return this._initializing();
    }

    // Public API method used by the getter and also by Blueprints
    _prompting() {
        return {
            askForControllerActions: prompts.askForControllerActions
        };
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return this._prompting();
    }

    // Public API method used by the getter and also by Blueprints
    _default() {
        return {
            insight() {
                statistics.sendSubGenEvent('generator', 'spring-controller-dotnet');
            }
        };
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return this._default();
    }

    // Public API method used by the getter and also by Blueprints
    _writing() {
        return {
            writing() {
                this.controllerClass = _.upperFirst(this.name) + (this.name.endsWith('Resource') ? '' : 'Resource');
                this.controllerInstance = _.lowerFirst(this.controllerClass);
                this.apiPrefix = _.kebabCase(this.name);

                if (this.controllerActions.length === 0) {
                    this.log(chalk.green('No controller actions found, adding a default action'));
                    this.controllerActions.push({
                        actionName: 'defaultAction',
                        actionMethod: 'Get'
                    });
                }

                // helper for Java imports
                this.usedMethods = _.uniq(this.controllerActions.map(action => action.actionMethod));
                this.usedMethods = this.usedMethods.sort();

                this.mappingImports = this.usedMethods.map(method => `org.springframework.web.bind.annotation.${method}Mapping`);
                this.mockRequestImports = this.usedMethods.map(
                    method => `static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.${method.toLowerCase()}`
                );

                this.mockRequestImports =
                    this.mockRequestImports.length > 3
                        ? ['static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*']
                        : this.mockRequestImports;

                this.mainClass = this.getMainClassName();

                this.controllerActions.forEach(action => {
                    action.actionPath = _.kebabCase(action.actionName);
                    action.actionNameUF = _.upperFirst(action.actionName);
                    this.log(
                        chalk.green(
                            `adding ${action.actionMethod} action '${action.actionName}' for /api/${this.apiPrefix}/${action.actionPath}`
                        )
                    );
                });

                this.template(
                    `${SERVER_TEST_SRC_DIR}package/web/rest/ResourceIntTest.cs.ejs`,
                    `${SERVER_TEST_SRC_DIR}${this.packageFolder}/web/rest/${this.controllerClass}IntTest.cs`
                );
                this.template(
                    `${SERVER_MAIN_SRC_DIR}Controllers/Resource.cs.ejs`,
                    `${SERVER_MAIN_SRC_DIR}${this.packageFolder}/web/rest/${this.controllerClass}.cs`
                );
            }
        };
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return this._writing();
    }
};