/**
 * on click button trigger a rule activation on a group
 * before activated all sibling rules should be deactivated
 * once activated it should inject active classes to container and items
 *
 * items should only get active classes from parent
 */


var dataObj = {
    groups: {
        alignment: {
            component: 'alignmentComponent',
            activeRule: 'flexStart',
            rules: {
                flexStart: {
                    parentClasses: 'alignment--flex-start',
                    childClasses: false
                },
                flexEnd: {
                    parentClasses: 'alignment--flex-end',
                    childClasses: false
                },
                center: {
                    parentClasses: 'alignment--center',
                    childClasses: false
                },

                spaceBetween: {
                    parentClasses: 'alignment--space-between',
                    childClasses: false
                },

                spaceAround: {
                    parentClasses: 'alignment--space-around',
                    childClasses: false
                }
            }
        }
    }
};


var actionButton = Vue.component('action-button', {
    props: {
        text: String,
        group: String,
        rule: String,
        activeRule: String,
    },
    computed : {
        isActive : function(){
            return (this.rule === this.activeRule);
        }
    },
    render: function (createElement) {

        return createElement(
            'button',
            {
                'class': {
                    'pure-button pure-button-primary flex-item': true,
                    'is-selected': this.isActive
                },
                'domProps': {
                    innerHTML: this.text
                },
                on: {
                    click: this.changeStyle
                },
            }
        );
    },
    methods: {
        changeStyle: function () {
            this.$root.$emit('styleChangeRequest', this.group, this.rule);
        }
    }
});


/**
 * Container component for flex items
 */
var flexContainterComponent = Vue.component('flex-container', {
    template: '#flex-container-template',
    props: {
        activeRule: {
            type: [String, Boolean],
            default: false
        },
        childCount: {
            type: [Number],
            default: 4
        },
        group: {
            type: [Object, Boolean],
            default: false
        }
    },
    data: function () {
        return {
            parentClasses: 'asdfa',
            childClasses: 'asdfa'
        }
    },
    computed: {
        currentClasses: function () {
            return ['flex-container', this.parentClasses];
        },
    },
    watch: {
        activeRule: function (val, oldVal) {
            this.setActiveRecordProps();
        }
    },
    created: function () {
        this.setActiveRecordProps();

    },
    methods: {
        setActiveRecordProps: function () {
            if (!this.group) {
                return;
            }
            //make active one in group active
            var activeRule = this.group.rules[this.group.activeRule];
            this.childClasses = activeRule.childClasses;
            this.parentClasses = activeRule.parentClasses;
            console.log(activeRule);
        }
    }
});

var Main = new Vue({
    el: '#layout',
    data: {
        groups: dataObj.groups
    },
    created: function () {
        this.$on('styleChangeRequest', this.styleChangeRequestHandler);
    },


    methods: {
        styleChangeRequestHandler: function (group, rule) {
            console.log(group, rule);
            console.log(this.groups[group]);
            this.groups[group].activeRule = rule;
            this.$forceUpdate();
        }
    }
});


/*
 var flexItemComponent = Vue.component('flex-item', {
 props: {
 text: String,
 classes: {
 type: String,
 default: '',
 }
 },
 render: function (createElement) {
 return createElement(
 'div',
 {
 'class': {
 'flex-item': true,
 },
 'domProps': {
 innerHTML: this.text,
 classList: this.classes + ' flex-item'
 }
 }
 )
 }
 });

 */