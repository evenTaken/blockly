
// Custom blocks
Blockly.common.defineBlocksWithJsonArray([{
    "type": "object",
    "message0": "{ %1 %2 }",
    "args0": [
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "MEMBERS"
        }
    ],
    "output": null,
    "colour": 230,
},
{
    "type": "member",
    "message0": "%1 %2 %3",
    "args0": [
        {
            "type": "field_input",
            "name": "MEMBER_NAME",
            "text": ""
        },
        {
            "type": "field_label",
            "name": "COLON",
            "text": ":"
        },
        {
            "type": "input_value",
            "name": "MEMBER_VALUE"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
}]);

// Custom tool box
var codelabToolbox = {
    'kind': 'flyoutToolbox',
    'contents': [
        {
            'kind': 'block',
            'type': 'object'
        },
        {
            'kind': 'block',
            'type': 'member'
        },
        {
            'kind': 'block',
            'type': 'math_number'
        },
        {
            'kind': 'block',
            'type': 'text'
        },
        {
            'kind': 'block',
            'type': 'logic_boolean'
        },
        {
            'kind': 'block',
            'type': 'logic_null'
        },
        {
            'kind': 'block',
            'type': 'lists_create_with'
        },
    ]
}

// Code generator
const codelabGenerator = new Blockly.Generator('JSON');
codelabGenerator.PRECEDENCE = 0;

codelabGenerator['logic_null'] = function (block) {
    return ['null', codelabGenerator.PRECEDENCE];
};

codelabGenerator['text'] = function (block) {
    var textValue = block.getFieldValue('TEXT');
    var code = '"' + textValue + '"';
    return [code, codelabGenerator.PRECEDENCE];
};

codelabGenerator['math_number'] = function (block) {
    const code = String(block.getFieldValue('NUM'));
    return [code, codelabGenerator.PRECEDENCE];
};

codelabGenerator['logic_boolean'] = function (block) {
    const code = (block.getFieldValue('BOOL') == 'TRUE')
        ? 'true'
        : 'false';
    return [code, codelabGenerator.PRECEDENCE];
};

codelabGenerator['member'] = function (block) {
    const name = block.getFieldValue('MEMBER_NAME');
    const value = codelabGenerator.valueToCode(
        block, 'MEMBER_VALUE', codelabGenerator.PRECEDENCE);
    const code = '"' + name + '": ' + value;
    return code;
};

codelabGenerator['lists_create_with'] = function (block) {
    const values = [];
    for (var i = 0; i < block.itemCount_; i++) {
        let valueCode = codelabGenerator.valueToCode(block, 'ADD' + i,
            codelabGenerator.PRECEDENCE);
        if (valueCode) {
            values.push(valueCode);
        }
    }
    const valueString = values.join(',\n');
    const indentedValueString =
        codelabGenerator.prefixLines(valueString, codelabGenerator.INDENT);
    const codeString = '[\n' + indentedValueString + '\n]';
    return [codeString, codelabGenerator.PRECEDENCE];
};

codelabGenerator['object'] = function (block) {
    const statement_members =
        codelabGenerator.statementToCode(block, 'MEMBERS');
    const code = '{\n' + statement_members + '\n}';
    return [code, codelabGenerator.PRECEDENCE];
};

// necessary to stack multiple member blocks in one object block
codelabGenerator.scrub_ = function (block, code, opt_thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !opt_thisOnly) {
        return code + ',\n' + codelabGenerator.blockToCode(nextBlock)
    }
    return code;
};