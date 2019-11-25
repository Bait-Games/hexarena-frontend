// THIS FILE IS LOCKED BY MARCO TEREH. ANYBODY ELSE PLEASE DO NOT COMMIT TO THIS FILE WITHOUT DISCUSSING IT FIRST.

const consts = require('./common_constants');
const BODYPART_TYPE = consts.BODYPART_TYPE;
const MAX_HEALTH = consts.MAX_HEALTH;
const MAX_INFLATE = consts.MAX_INFLATE;
const INFLATE_RATE = consts.INFLATE_RATE;
const ACTION = consts.ACTION;

class Users {
    constructor() {
        this._users = [];
        this._id = 0;
    }
    get _newId() {return this._id++};

    add(x, y) {
        let newId = this._newId();
        this._users.push(new User(
            newId,
            x, y
        ));
        return newId;
    }

    remove(id) {
        if (typeof(id) !== 'number') return;

        this._users = this._users.filter((user)=>{return user.id !== id});
    }

    forEach(...params) {
        // noinspection JSCheckFunctionSignatures
        this._users.forEach(...params);
    }

    with(id, cb) {
        let found = this._users.find(elem => elem.id === id);
        if (found){
            cb(found)();
        }
    }

    find(id) {
        let found = this._users.find(elem => elem.id === id);
        if (found){
            return found;
        }
        return null;
    }
}

module.exports = Users;

class User {
    constructor(id, x, y) {
        this.id = id;
        this.nextActions = [];

        this.x = x;
        this.y = y;
        this.movedV = false;
        this.movedH = false;

        this.callbacks = [];


        this.components = [
            {
                type: BODYPART_TYPE.CELL,
                faces: [-1, -1, -1, -1, -1, -1],
                health: MAX_HEALTH,
            },
        ];
        this.rotation = 0;
    }

    tick_reset() {
        this.movedH = false;
        this.movedV = false;
    }

    register(cb) {
        this.callbacks.push(cb);
    }

    update() {
        this.callbacks.forEach(cb => {
            cb(this.export());
        })
    }

    export() {
        return {
            id: this.id,
            position: {
                x: this.x,
                y: this.y
            }
        }
    }

    act(action) {
        this.nextActions.push(action);
    }

    grow(part, face, type) {
        //TODO: do
        //...
        let newComponent = {};
        switch (type) {
            case BODYPART_TYPE.BOUNCE:
                newComponent.inflated = MAX_INFLATE;
            case BODYPART_TYPE.SPIKE:
                newComponent.body = part; // maybe? depends on how exactly part is passed
        }
        //...
    }

    damage(part, amt) {
        let component = this.components[part];
        switch(component.type) {
            case BODYPART_TYPE.SPIKE:
                component = component.body;
            case BODYPART_TYPE.CELL:
                component.health -= amt;
                if (component.health <= 0) {
                    this.shrink(part);
                }
                break;
            case BODYPART_TYPE.SHIELD:
                break;
            case BODYPART_TYPE.BOUNCE:
                // TODO(anno): decide on how to handle inflating
                component.inflated = 0;
                // TODO(anno) if it's already deflated, transmit to body
                break;
            default:
                console.log('unknown bodypart encountered: ', component.type);
        }
    }

    shrink(part) {
        if (part === 0) {
            this.act({action: ACTION.DESTROY});
            return;
        }
        delete this.components[part];
        this.components.forEach(component => {
            component.faces.map(val => {
                if (val === part) {
                    return -1;
                }
                return val;
            })
        })
        // TODO(anno): remove no-longer-connected parts
        // depth-first search through all the parts, starting from 0. Mark them as connected,
        // then remove all non-connected parts
    }
}