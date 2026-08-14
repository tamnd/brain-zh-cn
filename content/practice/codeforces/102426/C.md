---
title: "CF 102426C - LytchenLovesJSON"
description: "该任务本质上是实现一个小型 JSON 解释器。 输入以一个有效的 JSON 文档开始，其根始终是一个对象。 该文档可能包含嵌套对象、数组、字符串、数字、布尔值和 null。"
date: "2026-08-14T15:23:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "C"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 175
verified: true
draft: false
---

[CF 102426C - LytchenLovesJSON](https://codeforces.com/problemset/problem/102426/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务本质上是实现一个小型 JSON 解释器。 

输入以一个有效的 JSON 文档开始，其根始终是一个对象。 该文档可能包含嵌套对象、数组、字符串、数字、布尔值和`null`。 它的格式是任意的，因此不能使用空格和换行符来确定各个值的结束位置。 

JSON 文档之后，剩下的每一行都是一个查询。 查询描述了对象图的路径。 一个名字，例如`birthday.year`意味着抬头`birthday`在当前对象中，然后`year`在生成的对象中。 后缀如`[3]`表示从字符串中获取数组元素或字符。 多个索引操作可以链接起来，如下所示`a[0][2]`。 

对于每个查询，我们要么达到一个值并以语句所需的特殊格式打印它，要么报告遇到的第一种错误。 缺少对象属性会产生`Error: no such attribute`。 应用于字符串或数组以外的任何内容的索引都会产生`Error: invalid type`。 超出其范围的有效字符串或数组索引会产生`Error: index overflow`。 

该文档最多包含 100 行，最多 100 个字符，因此其文本大小最多约为 10,000 个字符。 最多有 100 个查询，每个查询最多 100 个字符。 这些界限足够小，即使为每个查询重新解析整个文档，在最坏的情况下仍然只能扫描大约一百万个输入字符。 有用的工程选择仍然是解析一次，因为解析后的对象可以被每个查询重用，并且实现在概念上变得更清晰。 

JSON 语法还意味着通用字符串标记器是必要的。 JSON 值可以跨越多条物理线，任何结构标记之间都可以出现空格。 一个基于的解析器`split`、单行上的正则表达式或有关缩进的假设可能会默默失败。 

字符串需要特殊处理，因为它们的转义序列是问题可观察行为的一部分。 例如，考虑：```
{"s":"a\\nb"}
s
s[1]
```该字符串包含两个字符反斜杠和`n`在它的中间，而不是实际的换行符。 所需的输出为`s`是`a\nb`，并保留转义序列。 盲目使用 Python 的普通 JSON 解码器的解析器会变成`\n`换行并会产生错误的表示。 

第二个微妙的情况是转义引用：```
{"s":"a\"b"}
s
s[1]
```其值为`a"b`，所以输出是`a"b`索引字符是`"`。 将引号视为字符串结尾会破坏解析。 

索引也可以应用于字符串而不是数组：```
{"s":"abc"}
s[0]
s[3]
```正确的输出是：```
a
Error: index overflow
```粗心的实现使用`if index > len(s)`而不是`if index >= len(s)`会错误地接受`s[3]`。 

最后，属性查找可以遵循索引基元：```
{"a":[10]}
a[0].x
```结果是：```
Error: no such attribute
```后`a[0]`当前值为数字`10`，它没有对象属性。 这与对数字本身应用索引不同，后者是`invalid type`错误。 

## 方法

 最直接的解决方案是解析 JSON 文档并立即回答每个查询。 简单的实现甚至可以为每个查询独立地解析整个 JSON 文档。 由于文档最多有 10,000 个字符并且最多有 100 个查询，因此该方法最多执行约 1,000,000 个字符级解析操作以及查询处理。 在这些限制下，其实已经足够快了。 

这种方法的缺点是重复工作。 每个查询都从完全相同的根对象开始，因此重建相同的对象图最多 100 次没有算法上的好处。 

有用的观察结果是 JSON 文档在整个输入中是不可变的。 一旦它被转换为对象、数组和原始值的树，每个查询都只是遍历同一棵树。 我们可以精确地解析文档一次，将每个对象保留为字典，将每个数组保留为列表，然后根据存储的结构解释每个查询。 

解析器本身是一个递归下降解析器。 JSON有一个特别方便的递归结构：一个对象包含键值对，一个数组包含值，一个值可以递归地成为另一个对象或数组。 每个解析器函数使用共享位置中的字符并返回解析后的值和新位置。 

唯一的非标准部分是字符串处理。 解析器不会要求 Python 的 JSON 库解码字符串，而是自行处理转义。 越狱`\t`,`\\`,`\/`， 和`\"`被转换为相应的字符，而其他转义序列仍保持原义，因为输出规范要求保留它们。 这也为字符串索引提供了问题所期望的准确表示。 

这两种方法可以进行如下比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 为每个查询重新解析 JSON | O(QS + QL) | O(S)| 在这些限制下接受|
 | 解析一次，回答树上的查询 | O(S + QL) | O(S)| 已接受，优先 |

 这里`S`是 JSON 文档长度，`Q`是查询的数量，并且`L`是最大查询长度。 

## 算法演练

 1. 读取所有输入行并将它们连接成一个字符流。 我们无法通过查看行来决定 JSON 文档的结束位置，因为该文档可能包含任意格式和换行符。 
2. 使用递归下降 JSON 解析器解析根值。 解析器会跳过每个值之前的 JSON 空格，然后根据第一个字符进行分派。 一个`{`启动一个对象，`[`启动一个数组，`"`开始一个字符串，`t`或者`f`开始一个布尔值，`n`开始`null`，并且以符号或数字开始数字。 
3. 将每个解析值表示为包含其类型和数据的对。 对象存储从键到值的字典，数组存储值列表，字符串存储其处理后的字符表示，数字存储浮点值，原始布尔值和`null`都是直接存储的。 
4. 解析根对象后，使用解析器的当前字符位置来查找剩余的查询行。 这比尝试使用大括号或缩进来识别最后一个 JSON 行更安全，因为解析器已经确切知道根值的结束位置。 
5. 将每个查询拆分为`.`获取其属性访问段。 在每个段中，首先读取字母属性名称，然后读取每个`[index]`附加后缀。 
6. 从根对象开始每个查询。 对于每个属性名称，检查当前值是否为对象以及请求的键是否存在。 如果任一条件失败，则打印`Error: no such attribute`并停止处理该查询。 
7. 成功获取属性值后，从左到右处理其索引操作。 仅当当前值为字符串或数组时，索引才有效。 否则打印`Error: invalid type`。 
8. 对于有效的字符串或数组，将请求的索引与其长度进行比较。 索引在什么时候是合法的`0 <= index < length`。 如果超出该范围，则打印`Error: index overflow`; 否则用所选元素替换当前值。 
9. 使用完整的查询后，根据结果值的类型序列化结果值。 数字使用小数点后两位数字的定点表示法。 数组和对象以递归方式序列化，对象键在打印其键值对之前按字典顺序排序。 

整个查询评估过程中的不变式是`current`正是到目前为止处理的查询的前缀所达到的 JSON 值。 属性处理将其更改为当前对象的相应子对象，而索引处理将其更改为相应的元素或字符。 由于每个操作仅在检查当前类型和边界后执行，因此每个成功的转换都是 JSON 对象图中的有效边。 如果某个操作无法执行，则报告的错误与第一个无效操作完全对应。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Parser:
    def __init__(self, text):
        self.s = text
        self.n = len(text)
        self.i = 0

    def skip_ws(self):
        while self.i < self.n and self.s[self.i] in " \t\r\n":
            self.i += 1

    def parse(self):
        self.skip_ws()
        c = self.s[self.i]

        if c == '{':
            return self.parse_object()
        if c == '[':
            return self.parse_array()
        if c == '"':
            return ("string", self.parse_string())
        if c == 't':
            self.i += 4
            return ("bool", True)
        if c == 'f':
            self.i += 5
            return ("bool", False)
        if c == 'n':
            self.i += 4
            return ("null", None)

        return self.parse_number()

    def parse_string(self):
        self.i += 1
        result = []

        while True:
            c = self.s[self.i]
            self.i += 1

            if c == '"':
                return ''.join(result)

            if c != '\\':
                result.append(c)
                continue

            esc = self.s[self.i]
            self.i += 1

            if esc == 't':
                result.append('\t')
            elif esc == '\\':
                result.append('\\')
            elif esc == '/':
                result.append('/')
            elif esc == '"':
                result.append('"')
            else:
                # The statement requires other escape sequences
                # to be kept as written.
                result.append('\\')
                result.append(esc)

    def parse_number(self):
        start = self.i

        if self.s[self.i] == '-':
            self.i += 1

        while self.i < self.n and self.s[self.i].isdigit():
            self.i += 1

        if self.i < self.n and self.s[self.i] == '.':
            self.i += 1
            while self.i < self.n and self.s[self.i].isdigit():
                self.i += 1

        if self.i < self.n and self.s[self.i] in 'eE':
            self.i += 1
            if self.s[self.i] in '+-':
                self.i += 1
            while self.i < self.n and self.s[self.i].isdigit():
                self.i += 1

        return ("number", float(self.s[start:self.i]))

    def parse_object(self):
        self.i += 1
        obj = {}
        self.skip_ws()

        if self.s[self.i] == '}':
            self.i += 1
            return ("object", obj)

        while True:
            self.skip_ws()
            key = self.parse_string()

            self.skip_ws()
            self.i += 1  # ':'

            value = self.parse()
            obj[key] = value

            self.skip_ws()
            if self.s[self.i] == '}':
                self.i += 1
                return ("object", obj)

            self.i += 1  # ','

    def parse_array(self):
        self.i += 1
        arr = []
        self.skip_ws()

        if self.s[self.i] == ']':
            self.i += 1
            return ("array", arr)

        while True:
            arr.append(self.parse())
            self.skip_ws()

            if self.s[self.i] == ']':
                self.i += 1
                return ("array", arr)

            self.i += 1  # ','

def format_value(value):
    typ, data = value

    if typ == "bool":
        return "true" if data else "false"

    if typ == "number":
        return f"{data:.2f}"

    if typ == "string":
        return data

    if typ == "null":
        return "null"

    if typ == "array":
        return "[ " + ", ".join(format_value(x) for x in data) + " ]"

    # object
    items = []
    for key in sorted(data):
        items.append(f'"{key}": {format_value(data[key])}')
    return "{ " + ", ".join(items) + " }"

def answer_query(root, query):
    current = root

    for part in query.split('.'):
        p = 0

        while p < len(part) and part[p].isalpha():
            p += 1

        key = part[:p]

        if current[0] != "object" or key not in current[1]:
            return "Error: no such attribute"

        current = current[1][key]

        while p < len(part):
            # part[p] must be '[' because the input is guaranteed valid.
            p += 1
            start = p

            while p < len(part) and part[p].isdigit():
                p += 1

            index = int(part[start:p])
            p += 1  # ']'

            if current[0] not in ("string", "array"):
                return "Error: invalid type"

            if index >= len(current[1]):
                return "Error: index overflow"

            if current[0] == "string":
                current = ("string", current[1][index])
            else:
                current = current[1][index]

    return format_value(current)

def main():
    lines = []
    while True:
        line = input()
        if not line:
            break
        lines.append(line)

    text = ''.join(lines)

    parser = Parser(text)
    root = parser.parse()

    # The parser stops exactly after the JSON document.
    rest = text[parser.i:]

    queries = rest.splitlines()
    out = []

    for query in queries:
        query = query.strip()
        if query:
            out.append(answer_query(root, query))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```这`Parser`类维护一个游标，`self.i`，进入完整的输入流。 每个解析函数都精确地消耗属于其值的字符。 递归调用自然会处理嵌套，因此包含数组的对象（包含另一个对象）不需要特殊情况的深度逻辑。`parse_string`值得特别关注。 输出规则明确关心的四种转义形式被转换为其实际字符。 其他转义符保留其前导反斜杠。 尤其，`\u25A0`保持六字符序列`\u25A0`，匹配所需的输出行为而不是Python的Unicode解码行为。`parse_number`独立使用可选符号、整数部分、小数部分和指数。 输入保证包含有效的 JSON，因此解析器不需要验证每个格式错误的数字情况。 

查询求值器在处理括号之前会特意检查属性。 一个查询，例如`missing[0]`必须报告缺失的属性而不是无效的索引类型，因为没有可供索引操作的值。 

索引边界检查使用`index >= len(current[1])`。 由于指数保证非负，因此没有单独的下限情况。 Python 本身具有负索引，因此在限制较少的输入格式中明确拒绝负索引是必要的，但这里每个查询索引都已经是非负的。 

序列化器递归地格式化数组和对象。 对象键在输出时排序，因为输入顺序不一定是所需的输出顺序。 数值的格式为`:.2f`，它精确地提供了小数点后两位数字。 

## 工作示例

 所提供的声明包含一份大样本。 提示中的摘录似乎丢失或损坏了最终结果周围的部分样本`teammates`查询，因此以下跟踪使用该示例的明确部分。 

对于查询`grades[4][1]`，文档的相关部分是：```
"grades": [90, 80, 88, 100, [55, 80]]
```评估进行如下。 

| 步骤| 运营| 当前值|
 | --- | --- | --- |
 | 1 | 从根开始 | 对象|
 | 2 | 使用权`grades`|`[90, 80, 88, 100, [55, 80]]`|
 | 3 | 申请`[4]`|`[55, 80]`|
 | 4 | 申请`[1]`|`80`|
 | 5 | 格式编号|`80.00`|

 关键不变量在这里可见：每次操作之后，`current`正是查询处理后的前缀所描述的值。 第二个索引对从第一个索引获得的数组进行操作，而不是对原始数组进行操作`grades`大批。 

对于第二个示例，请考虑：```
{
"a": {
"z": 1,
"x": [10, 20]
},
"s": "abc"
}
a.x[1]
s[2]
a.x[2]
a.x[0].missing
```第一个查询沿着一个对象边，另一个对象边，一个数组边，最后到达数字`20`。 

| 步骤| 运营| 当前值|
 | --- | --- | --- |
 | 1 | 从根开始 | 对象|
 | 2 | 使用权`a`| 对象|
 | 3 | 使用权`x`|`[10, 20]`|
 | 4 | 申请`[1]`|`20`|
 | 5 | 格式|`20.00`|

 为了`s[2]`，字符串被直接索引并产生`c`。 为了`a.x[2]`，数组的长度为二，所以索引`2`超出了法定范围`0`通过`1`，生产`Error: index overflow`。 为了`a.x[0].missing`，索引成功并将当前值保留为数字`10`; 以下属性查找无法找到对象属性并产生`Error: no such attribute`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(S + QL + S log S) | 在存储的对象中，解析成本为 O(S)，查询成本为 O(QL)，序列化期间对对象键进行排序成本至多为 O(S log S) |
 | 空间| O(S)| 解析后的 JSON 树存储文档的值、键、数组和嵌套对象 |

 这里`S`最多约10,000个字符，`Q`最多为 100，并且`L`最多 100。即使是重复解析方法也只能扫描大约一百万个文档字符，而所选的实现会解析一次并重用生成的树。 内存使用量完全低于 128 MB。 

## 测试用例

 下面的测试工具假设提交的解决方案保存为`solution.py`并暴露了`main`入口点。 帮助器调用该确切的程序，这使得断言测试用于提交的相同解析器、查询评估器和序列化器。```python
import subprocess
import sys

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True
    )
    return result.stdout

# Provided sample core
sample1 = r'''{
"name": "Lchen",
"gender": false,
"height": 1.60e+2,
"birthday": {
"year": 2000,
"month": 1,
"day": 1,
"aggregate": [2000, 1, 1]
},
"grades": [90, 80, 88, 100, [55, 80]],
"laboratory": null
}
name
name[0]
name.gender
gender
gender[1]
height
birthday.year
grades[2]
grades[4]
grades[4][1]
laboratory
grades[5]
'''

assert run(sample1) == (
    "Lchen\n"
    "L\n"
    "Error: no such attribute\n"
    "false\n"
    "Error: invalid type\n"
    "160.00\n"
    "2000.00\n"
    "88.00\n"
    "[ 55.00, 80.00 ]\n"
    "80.00\n"
    "null\n"
    "Error: index overflow"
), "provided sample core"

# Custom 1: minimum-size object, missing attribute, invalid index type.
case1 = '''{"a":0}
a
b
a[0]
'''
assert run(case1) == (
    "0.00\n"
    "Error: no such attribute\n"
    "Error: invalid type"
), "minimum object and error types"

# Custom 2: nested arrays and string escape handling.
case2 = r'''{
"a": [[1, 2], []],
"s": "A\\B"
}
a[0][1]
a[1][0]
s[1]
'''
assert run(case2) == (
    "2.00\n"
    "Error: index overflow\n"
    "\\"
), "nested indexing and backslash"

# Custom 3: boundary index, object key sorting, exponent and negative number.
case3 = '''{
"z": 3,
"a": {
"y": 2,
"x": [-12.5e0, 3]
}
}
a
a.x[0]
a.x[2]
z
'''
assert run(case3) == (
    '{ "x": [ -12.50, 3.00 ], "y": 2.00 }\n'
    "-12.50\n"
    "Error: index overflow\n"
    "3.00"
), "sorting, exponent and upper-bound index"

# Custom 4: maximum number of JSON lines and maximum number of queries.
keys = [chr(ord('a') + i) for i in range(26)]
keys += ['a' + chr(ord('a') + i) for i in range(26)]
keys += ['b' + chr(ord('a') + i) for i in range(26)]
keys += ['c' + chr(ord('a') + i) for i in range(20)]

json_lines = ['{']
for i, key in enumerate(keys):
    json_lines.append(f'"{key}": 7' + (',' if i + 1 < len(keys) else ''))
json_lines.append('}')

# Add enough repeated queries to reach the 100-query limit.
queries = [keys[i % len(keys)] for i in range(100)]
max_case = '\n'.join(json_lines + queries) + '\n'

expected = ''.join("7.00\n" for _ in range(100)).rstrip('\n')
assert run(max_case) == expected, "maximum query count and large document"
```定制案例具有不同的失效模式和结构特性。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`{"a":0}`和`a`,`b`,`a[0]`|`0.00`，缺少属性，无效类型 | 最小大小对象和错误优先级 |
 | 嵌套数组`"A\\B"`|`2.00`, 溢出,`\`| 多个索引和字符串转义处理 |
 | 嵌套对象与`[-12.5e0,3]`| 已排序的对象，`-12.50`, 溢出,`3.00`| 数值解析、序列化、键排序、上限 |
 | 包含 100 个查询的 100 行文档 | 100行`7.00`| 最大查询数和大文档处理 |

 ## 边缘情况

 对于转义字符串，请考虑：```
{"s":"a\"b"}
s
s[1]
```解析器在第一个引号后输入字符串。 当它看到`\"`，它消耗两个字符并附加文字引号而不是终止字符串。 存储的值为`a"b`，所以第一个查询打印`a"b`和第二张照片`"`。 搜索下一个原始引用的解析器会过早终止字符串。 

对于应保持文本形式的转义序列，请考虑：```
{"s":"x\u25A0y"}
s
```解析器看到`\u`，认识到它不是应该解码的四种转义形式之一，并存储反斜杠和`u`，后面跟着作为普通字符的其余数字。 结果输出是`x\u25A0y`。 使用`json.loads`直接创建一个 Unicode 黑色方块字符，并且会违反指定的输出行为。 

对于字符串索引，请考虑：```
{"s":"abc"}
s[0]
s[2]
s[3]
```前两个查询选择`a`和`c`。 第三个看到`index == len(s)`，所以它报告`Error: index overflow`。 同样的条件也适用于数组。 合法区间是半开的，`[0, length)`。 

对于无效的索引类型，请考虑：```
{"x":false,"y":null,"z":{"a":1}}
x[0]
y[0]
z[0]
```所有三个查询都会产生`Error: invalid type`。 布尔值，`null`，并且对象值不可索引。 解析器不会尝试解释 Python 特定的操作，例如索引字典或布尔值。 

对于成功索引后丢失的属性，请考虑：```
{"a":[10]}
a[0].x
```

`a`解析为数组，`[0]`解析为数字`10`， 和`.x`然后询问该数字的属性。 由于只有对象才具有属性，因此正确的结果是`Error: no such attribute`。 该实现在查看字典之前检查当前值的类型。 

对于嵌套数组，请考虑：```
{"a":[[[7]]]}
a[0][0][0]
```第一个索引将当前值从外部数组更改为中间数组，第二个索引将其更改为内部数组，第三个到达`7`，打印为`7.00`。 按顺序处理括号可以使任意数量的链式索引在没有特殊情况的情况下工作。 

对于对象格式化，请考虑：```
{"z":1,"a":2}
a
```输出是：```
{ "a": 2.00, "z": 1.00 }
```输入顺序无关紧要。 序列化程序在构造输出之前对字典键进行排序，这是必要的，因为不能保证输入中的 JSON 对象顺序与所需的字典顺序匹配。
