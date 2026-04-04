/*
Abstract Class: PDU
│
└── Attributes
│   └── payload (String) — Private/Protected                                DONE
│
└── Methods                                                                 DONE 4/4
├── Constructor(payload)                                                    DONE
├── get payload() — Getter                                                  DONE
├── set payload(val) — Setter                                               DONE
└── isValid() — Abstract                                                    DONE
│
└── Child Class: EthFrame                                                   DOING
│
├── Attributes (Extended)                                                   DONE 4/4
│   ├── dmac (String)                                                       DONE
│   ├── smac (String)                                                       DONE
│   ├── type (Integer)                                                      DONE
│   └── fcs (Integer) — Read-only via getter                                DONE
│
├── Methods (Implemented/Overridden)                                        DOING 9/9
│   ├── Constructor(dmac, smac, type, payload, fcs)                         DONE
│   ├── get / set dmac(val) — Triggers re-hash                              DONE
│   ├── get / set smac(val) — Triggers re-hash                              DONE
│   ├── get / set type(val) — Triggers re-hash                              DONE
│   ├── set payload(val) — Overridden; triggers re-hash                     DONE
│   ├── get fcs() — Explicit getter only                                    DONE
│   ├── calculateFcs() — Logic for hashing                                  DONE
│   ├── recalculateFcs() — Internal utility                                 DONE
│   └── isValid() — Overridden; compares current fcs                        DONE
│
└── Utilities (Static/Special)                                              TODO 1/3
├── static isValidMac(mac) — Regex check                                    TODO
├── toString() — Debug string rendering                                     DONE
└── corruptData() — Manual error injection                                  TODO
*/
abstract class PDU {
    /* ==================================
    Here are variables defined
    ================================== */
    protected _payload: string;


    /*
    +===========================================+
    | Here are the methods including constructor|
    +===========================================+
    */
    constructor(payload: string) {
        this._payload = payload
    }
    
    public get payload() : string {
        return this._payload;
    }
    public set payload(v : string) {
        this._payload = v;
    }
    abstract isValid(): boolean;
}


class EtherFrame extends PDU {
    /*
    =========================
    | Attributes need to be | 
    | passed onto contructor|
    =========================
    */
    protected       _dmac:   string;
    protected       _smac:   string;
    protected       _type:   number;
    protected       _fcs:    number;


    constructor(dmac: string,smac:string,type:number,payload: string,fcs:number=0) {
        super(payload)
        this._dmac = dmac
        this._smac = smac
        this._type = type
        if (fcs === 0) {
            this.recalculateFcs()
        } else {
            this._fcs = fcs;
        }
    }

    /*
    ======================================================
    |      The following text contains high              |
    |      concetration of setters.                      |
    |      In case you start seeing setters on walls     |
    |      you may be going crazy. Please contact        |
    |      appropriate authorities or consult your       | 
    |      nearest getter for safe memory allocation tips|
    ======================================================
    */
    // SMAC
        
        public set smac(v : string) {
            this._smac = v;
            this.recalculateFcs()
        }
        
        public get smac() : string {
            return this._dmac
        }
        
    // DMAC
        
        public set dmac(v : string) {
            this._dmac = v;
            this.recalculateFcs()
        }
        
        
        public get dmac() : string {
            return this._dmac
        }
    // fcs
        
        public get fcs() : number {
            return this._fcs
        }
    // payload change
        public set payload(v : string) {
            this._payload = v;
            this.recalculateFcs()
        }
        
        

    // The mandatory something. Createa val
    isValid(): boolean {
        return this._fcs === this.calculateFcs();
    }

    private calculateFcs(): number {
        const combined = this._dmac + this._smac + this._type.toString() + this.payload;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            hash += combined.charCodeAt(i);
        }
        return hash;
    }

    private recalculateFcs(): void {
        this._fcs = this.calculateFcs();
    }

    static isValidMac(mac: string): boolean {
        const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        return regex.test(mac);
    }
}

/* OUT OF DATE Test #1
=========================================================
This returned as console log said                       |
    'This is stuff' - Init          Getter              |
    'Stuff'         - Setter        Both set and get    |
=========================================================

var something = new EtherFrame('This is stuff');    // This is defined parameter.
console.log(something.payload)                      // This is the getter implementation
something.payload = "Stuff"                         // This is the setter implementation
console.log(something.payload)                      // This is the changed payload
*/



