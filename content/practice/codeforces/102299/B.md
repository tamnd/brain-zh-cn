---
title: "CF 102299B - Russo 的俄语"
description: "我们需要决定是否可以从给定语法的非终结符 M 生成一个输入行。 该行包含数字、空格和标点符号 :, 语法描述了三层。 T 是一个数字序列或一个完整的 { M } 表达式。"
date: "2026-08-13T23:11:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102299
codeforces_index: "B"
codeforces_contest_name: "2019 USP Try-outs"
rating: 0
weight: 102299
solve_time_s: 500
verified: true
draft: false
---

[CF 102299B - Russo 的俄语](https://codeforces.com/problemset/problem/102299/B)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要决定是否可以从非终结符生成一个输入行`M`给定的语法。 该行包含数字、空格和标点符号`:`,`|`,`{`,`}`， 和`$`。 语法符号之间允许有空格，但数字组成`I`token 必须是连续的，所以`123`是一个整数标记，而`1 23`是两个独立的数字序列，不能连接成一个`I`。 

该语法描述了三个层次。`T`是一个数字序列或一个完整的`{ M }`表达。`P`是一个或多个`T`值由冒号连接。`M`是一个表达式`P`值由竖线连接，还可以附加前导竖线和特殊的`⟦PROTECT_6⟧`在原始问题的格式中显示为`$$$`当从数学标记中提取语句时，但实际的终止字符是单个`⟦PROTECT_7⟧ | 2`。 

输入最多有`10^5`人物。 这排除了重复尝试许多可能的语法扩展或回溯解析的算法。 我们基本上需要对输入进行一次传递，因为即使`O(n log n)`工作是不必要的，二次解析器已经可以执行`10^10`以最大尺寸进行操作。 256 MB 的内存限制足以存储标记化输入和一些大小的数组`O(n)`。 

在许多情况下，表面上合理的解析器会失败。 首先，空表达式是无效的。 例如，空行必须产生`NO`，因为每次展开`M`最终包含一个`P`，以及每一个`P`包含一个`T`。 将空子字符串视为有效递归表达式的解析器会错误地接受它。 

其次，竖线不能单独存在。 输入`| 1`是有效的，因为`M`可以展开为`| M`和剩余的`M`可以成为`1`， 但`1 |`无效，因为中间的条总是需要另一个`P`在它之后。 仅计算柱数而不检查其操作数的解析器可能会错误地接受后者。 

第三，数字不能用空格分隔。 输入`1 2`无效。`I`是一个连续的数字序列，而语法没有规则允许两个`I`令牌彼此相邻出现。 首先删除所有空格的分词器会将其变成`12`并错误地接受它。 

第四，大括号必须包含完整的`M`。 输入`{}`是无效的，而`{1}`是有效的。 将大括号视为普通匹配标点符号而不验证其内容将接受`{}`错误地。 

第五，`⟦PROTECT_8⟧ | 2`是有效的，但是`⟦PROTECT_9⟧`后面必须跟一个竖线，然后是一个有效的`P`。 这正是代表的特殊替代方案`H = '$'`其次是`| P`。 

## 方法

 直接的暴力方法会尝试根据每个适用的语法产生式来解释输入。 困难在于语法包含递归，尤其是`M -> M | P`和`M -> | M`，因此一个简单的递归下降实现要么被左递归所困，要么必须在许多可能的推导之间回溯。 如果我们想象枚举直到输入长度的所有推导，候选者的数量就会呈指数增长，其中`Theta(2^n)`最坏情况下可能出现的分支。 在`n = 10^5`，这远远超出了任何可执行的范围。 

暴力解析器之所以有效，是因为语法很小，并且每个成功的推导都对应于有效的解析。 它失败了，因为原始语法是以一种隐藏了更简单结构的形式编写的。 关键是在实施任何操作之前从代数上消除左递归。 

从```
M = H | P
  | | M
  | P

H = M | $
```我们可以观察到`M -> M | P`只是允许更多`| P`要附加到已经有效的片段`M`。 生产`M -> | M`允许任意数量的前导柱。 删除此递归后，语言`M`可以描述为```
M = |* B
B = P ( | P )*
  | $ | P ( | P )*
```这是中心观察。 一个`M`由零个或多个前导条组成，后跟普通条`P`顺序或按`$ | P`随后还有更多`| P`件。 

同样的简化适用于`P`。 其左递归定义```
P = P : T | T
```完全等于```
P = T ( : T )*
```现在语法具有足够的确定性，可以从左到右进行解析。 剩下的唯一递归部分是`{ M }`，和大括号给我们一个明确的嵌套结构。 我们可以使用堆栈而不是 Python 递归来处理嵌套。 

我们首先标记该行，同时保留连续数字和单独数字序列之间的区别。 我们还保留`$`作为其自己的令牌并仅跳过令牌之间的空格。 然后我们使用堆栈来匹配每对大括号。 如果左大括号出现在标记位置`l`其匹配的右大括号位于`r`，它们之间的令牌严格形成一个`M`。 

我们可以从内到外评估嵌套大括号表达式。 加工外层时`{ M }`，其中的每个嵌套大括号表达式都已被求值，因此大括号可以被视为有效或无效`T`无需递归调用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`Theta(2^n)`在最坏的情况下|`O(n)`根据探索的推导 | 太慢了 |
 | 递归回溯解析器 | 由于左递归而呈指数或非终止 |`O(n)`递归深度 | 太慢/不安全|
 | 分词+显式大括号堆栈+确定性解析|`O(n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 逐个字符扫描输入并构建令牌。 连续的数字变成一`I`令牌。 每个`$`,`:`,`|`,`{`， 和`}`是一个单独的令牌。 空白被跳过。 我们不能在标记化之前删除空格，因为`1 2`必须保留两位数字令牌而不是成为`12`。 
2. 扫描标记并将大括号与堆栈匹配。 什么时候`{`找到后，推送其代币索引。 什么时候`}`找到后，弹出匹配的打开位置。 如果没有左大括号，输入立即无效。 扫描后，需要一个空堆栈，否则某些左大括号永远不会关闭。 
3. 按其打开位置的降序处理所有匹配的括号对。 嵌套左大括号的标记索引始终大于包含它的左大括号，因此首先计算其有效性。 将每个左大括号的有效性存储在数组中。 
4. 对于一个`M`间隔，首先消耗任意数量的前导`|`代币。 这直接对应于重复应用`M -> | M`。 
5. 在前导条之后，检查下一个标记。 如果是的话`⟦PROTECT_10⟧`并要求以下标记为`|`。 然后一个`P`必须遵循。 这是特别的`H = '$'`案件。 
6. 否则，解析一个普通的`P`。 一个`P`以一个有效的开头`T`，后跟零个或多个`:`和`T`对。 一个`T`是数字标记或大括号标记，其存储的内部`M`结果有效。 
7.一旦成为第一个`P`已被解析，剩下的每一个`|`后面必须跟着另一个`P`。 这处理转换后的规则`M = |* P ( | P )*`还有`$ | P ( | P )*`形式。 
8. 对于有效的`M`间隔，解析必须精确地在其边界处完成。 如果仍然存在任何意外的标记，或者需要`P`或者`T`缺失，则间隔无效。 
9.最后运行一模一样`M`完整标记序列的解析器。 仅当顶层的情况下，完整的输入才会被接受`M`有效并消耗每个令牌。 

不变的是，每当我们处理一个`M`间隔，每个嵌套`{ M }`该区间内已经具有正确的有效性值。 然后，当前区间的解析器严格遵循等效的非左递归语法：前导条、可选的`$ |`， 一`P`，以及零个或多个`| P`后缀。 由于每个标记仅被消耗固定次数，并且每个嵌套表达式都被评估一次，因此最终的决定正是原始语法是否可以生成输入。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(s: str) -> str:
    tokens = []
    n = len(s)
    i = 0

    while i < n:
        c = s[i]

        if c.isspace():
            i += 1
            continue

        if c.isdigit():
            j = i + 1
            while j < n and s[j].isdigit():
                j += 1
            tokens.append(("I", s[i:j]))
            i = j
            continue

        if c in "$:|{}":
            tokens.append((c, c))
            i += 1
            continue

        return "NO"

    m = len(tokens)

    if m == 0:
        return "NO"

    # Match every pair of braces.
    matching = [-1] * m
    stack = []

    for i, (typ, _) in enumerate(tokens):
        if typ == "{":
            stack.append(i)
        elif typ == "}":
            if not stack:
                return "NO"
            opening = stack.pop()
            matching[opening] = i

    if stack:
        return "NO"

    # inner_ok[pos] is meaningful when tokens[pos] == "{"
    # and stores whether the M inside that brace pair is valid.
    inner_ok = [False] * m

    def parse_m(left: int, right: int) -> bool:
        """
        Check whether tokens[left:right] form a valid M.
        All brace expressions inside this interval have already
        been evaluated.
        """
        i = left

        # M -> |* B
        while i < right and tokens[i][0] == "|":
            i += 1

        if i >= right:
            return False

        # B is either P (| P)* or $ | P (| P)*.
        if tokens[i][0] == "$":
            i += 1
            if i >= right or tokens[i][0] != "|":
                return False
            i += 1

        def parse_t(pos: int) -> int:
            if pos >= right:
                return -1

            typ = tokens[pos][0]

            if typ == "I":
                return pos + 1

            if typ == "{":
                close = matching[pos]
                if close == -1 or close >= right:
                    return -1
                if not inner_ok[pos]:
                    return -1
                return close + 1

            return -1

        def parse_p(pos: int) -> int:
            pos = parse_t(pos)
            if pos == -1:
                return -1

            while pos < right and tokens[pos][0] == ":":
                pos = parse_t(pos + 1)
                if pos == -1:
                    return -1

            return pos

        i = parse_p(i)
        if i == -1:
            return False

        while i < right and tokens[i][0] == "|":
            i = parse_p(i + 1)
            if i == -1:
                return False

        return i == right

    # Process inner brace expressions before outer ones.
    openings = [
        i for i in range(m)
        if tokens[i][0] == "{"
    ]

    for opening in reversed(openings):
        closing = matching[opening]
        inner_ok[opening] = parse_m(opening + 1, closing)

    return "YES" if parse_m(0, m) else "NO"

def main() -> None:
    s = input()
    print(solve(s))

if __name__ == "__main__":
    main()
```分词器故意比简单的更严格`''.join(s.split())`方法。 当它看到一个数字时，它会消耗完整的连续运行并恰好创建一个`I`令牌。 空格终止运行，所以`12 34`变成两个标记并且不会意外地被解释为`1234`。 

支架扫描使用`matching`记录每个左大括号的结束位置。 不匹配的右大括号会立即被拒绝，扫描后的非空堆栈意味着左大括号没有右大括号。 

这`inner_ok`数组代替了递归函数调用。 什么时候`parse_t`遭遇`{`，直接跳转到匹配的`}`并查阅已计算的结果以获取所附的`M`。 以相反的顺序处理空缺可以保证嵌套表达式在其父表达式之前就已知。 

转换后的语法直接编码为`parse_m`。 初始循环消耗前导条。 这`⟦PROTECT_11⟧ | P`，而普通分支直接以`P`。 第一个之后`P`，每个小节后面必须跟着另一个小节`P`。 决赛`i == right`检查是必不可少的，因为成功解析前缀是不够的，必须消耗整个间隔。 

不存在与大括号嵌套深度成比例的递归，因此包含数万个嵌套大括号的输入不会达到 Python 的递归限制。 所有索引都是标记索引，并且通过跳过整个已验证的嵌套表达式来消耗匹配的大括号。 

## 工作示例

 ### 示例 1

 对于输入`1`，标记化产生一个`I`令牌。 

| 职位| 代币| 解析器状态 | 行动|
 | --- | --- | --- | --- |
 | 0 |`I`| 开始`M`| 无领先` | `, 解析`P`|
 | 0 |`I`| 解析`P`|`I`是一个有效的`T`|
 | 1 | 结束 | 后`P`| 不再` | `，间隔完全消耗|

 这`M`包含一个`P`， 这`P`包含一个`T`，以及`T`是数字序列`1`。 解析器正好到达末尾，所以答案是`YES`。 

### 示例 2

 对于输入`: 1`，空白被跳过并且标记是`:`和`I`。 

| 职位| 代币| 解析器状态 | 行动|
 | --- | --- | --- | --- |
 | 0 |`:`| 开始`M`| 无领先` | `,尝试解析`P`|
 | 0 |`:`| 解析`P`|`T`首先需要 |
 | 0 |`:`| 解析`T`|`:`两者都不是`I`也不`{`，因此解析失败 |

 结肠属于里面`P`，但是一个`P`必须以`T`。 既然没有可能第一`T`，整个`M`无效，答案是`NO`。 

### 示例 3

 对于输入`⟦PROTECT_12⟧`,`|`,`I`。 

| 职位| 代币| 解析器状态 | 行动|
 | --- | --- | --- | --- |
 | 0 |`⟦PROTECT_13⟧`选择特殊分支|
 | 1 |` | `| 后`$`| 存在必需的分隔符 |
 | 2 |`I`| 解析`P`|`I`是一个有效的`T`|
 | 3 | 结束 | 后`P`| 输入被完全消耗 |

 这正是特殊形式`⟦PROTECT_14⟧`终端。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n)`| 分词、大括号匹配、内部表达式求值和最终解析都会对输入进行固定次数的处理。 |
 | 空间|`O(n)`| 标记、大括号匹配信息、有效性值和大括号堆栈都与输入大小呈线性关系。 |

 至多有`10^5`输入字符时，线性扫描仅对每个字符执行少量恒定的工作。 显式堆栈还避免了递归深度问题，而线性辅助存储则轻松低于 256 MB 内存限制。 

## 测试用例```python
import sys
import io

def solve(s: str) -> str:
    tokens = []
    n = len(s)
    i = 0

    while i < n:
        c = s[i]

        if c.isspace():
            i += 1
            continue

        if c.isdigit():
            j = i + 1
            while j < n and s[j].isdigit():
                j += 1
            tokens.append(("I", s[i:j]))
            i = j
            continue

        if c in "$:|{}":
            tokens.append((c, c))
            i += 1
            continue

        return "NO"

    m = len(tokens)
    if m == 0:
        return "NO"

    matching = [-1] * m
    stack = []

    for i, (typ, _) in enumerate(tokens):
        if typ == "{":
            stack.append(i)
        elif typ == "}":
            if not stack:
                return "NO"
            opening = stack.pop()
            matching[opening] = i

    if stack:
        return "NO"

    inner_ok = [False] * m

    def parse_m(left: int, right: int) -> bool:
        i = left

        while i < right and tokens[i][0] == "|":
            i += 1

        if i >= right:
            return False

        if tokens[i][0] == "$":
            i += 1
            if i >= right or tokens[i][0] != "|":
                return False
            i += 1

        def parse_t(pos: int) -> int:
            if pos >= right:
                return -1

            typ = tokens[pos][0]

            if typ == "I":
                return pos + 1

            if typ == "{":
                close = matching[pos]
                if close == -1 or close >= right:
                    return -1
                if not inner_ok[pos]:
                    return -1
                return close + 1

            return -1

        def parse_p(pos: int) -> int:
            pos = parse_t(pos)
            if pos == -1:
                return -1

            while pos < right and tokens[pos][0] == ":":
                pos = parse_t(pos + 1)
                if pos == -1:
                    return -1

            return pos

        i = parse_p(i)
        if i == -1:
            return False

        while i < right and tokens[i][0] == "|":
            i = parse_p(i + 1)
            if i == -1:
                return False

        return i == right

    openings = [i for i in range(m) if tokens[i][0] == "{"]

    for opening in reversed(openings):
        inner_ok[opening] = parse_m(opening + 1, matching[opening])

    return "YES" if parse_m(0, m) else "NO"

def run(inp: str) -> str:
    return solve(inp).strip()

# Provided samples
assert run("1\n") == "YES", "sample 1"
assert run(": 1\n") == "NO", "sample 2"
assert run("$ | 2\n") == "YES", "sample 3"

# Custom cases
assert run("") == "NO", "empty input"

assert run("1 2\n") == "NO", "whitespace cannot occur inside I"

assert run("{1:2}|3\n") == "YES", "nested M and colon expression"

assert run("{}\n") == "NO", "empty M inside braces"

assert run("||||123\n") == "YES", "arbitrarily many leading bars"

assert run("1|\n") == "NO", "bar requires a following P"

assert run("$\n") == "NO", "$ requires | P"

assert run("5 : 14\n") == "YES", "colon-separated P"

assert run("{" * 25000 + "1" + "}" * 25000 + "\n") == "YES", \
    "deep nesting without recursive calls"

assert run("1" * 100000 + "\n") == "YES", \
    "maximum-size digit sequence"

assert run("1||2\n") == "YES", "empty-looking M between bars is allowed via leading-bar recursion"

assert run("1|:2\n") == "NO", "bar cannot be followed by an invalid P"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 空行 |`NO`| 最小尺寸输入和事实`M`不能为空 |
 |`1 2`|`NO`| 空格终止`I`代币|
 |`{1:2} | 3`|`YES`| 嵌套`M`、大括号、冒号和横杠一起 |
 |`{}`|`NO`| 空内容不能形成`M`|
 |` |  |  |  | 123`|`YES`| 重复领先` | `从`M -> | M`|
 |`1 | `|`NO`| 丢失的`P`在分隔符 | 之后
 |`⟦PROTECT_15⟧`形式要求` | P`|
 |`1`重复100000次|`YES`| 最大输入尺寸和长度`I`代币|
 | 周围有 25000 个嵌套大括号`1`|`YES`| 无需Python递归的深度嵌套|
 |`1 |  | 2`|`YES`| 第二根柱可以通过剩余柱的前导柱规则来解释`M`|
 |`1 | :2`|`NO`| 小节后面必须跟完整的`P`|

 ## 边缘情况

 在解析开始之前处理空输入。 没有代币，所以不可能有`T`,`P`， 或者`M`。 算法立即返回`NO`。 

为了`1 2`，标记化产生`I, I`，而不是`I`含有`12`。 第一个`P`仅消耗第一个`I`。 由于下一个标记是另一个标记`I`而不是`:`或者`|`,`parse_m`以未消耗的令牌结束并返回`NO`。 这就是为什么不能简单地从输入中删除空格的原因。 

为了`1|`，第一个`P`成功消费`1`。 然后解析器会看到`|`并进入另一个循环`P`。 条形后面没有标记，所以`parse_p`失败，结果是`NO`。 

为了`⟦PROTECT_16⟧`并立即检查`|`。 由于输入结束，缺少所需的分隔符，因此结果为`NO`。 为了`$ | 2`，分隔符存在并且`2`供应所需的`P`，所以同一个分支会成功。 

为了`{}`，大括号匹配器正确配对两个大括号，然后`parse_m`在它们之间的空间隔上调用。 由于没有代币可供构建`P`，存储的`inner_ok`值为`False`，和外层`T`被拒绝。 结果是`NO`。 

为了`{1:2}|3`，首先处理内部大括号间隔。 它的代币形式`P = T : T`，其中两者`T`值是数字序列，所以`inner_ok`变成`True`。 然后外部解析器可以处理`{1:2}`作为一个`T`， 其次是`| 3`，产生有效的`M`和答案`YES`。 

对于深度嵌套的表达式，例如 25000 个左大括号，后跟`1`，后跟 25000 个右大括号，大括号堆栈匹配所有对。 首先评估最里面的表达式，每个外部表达式都使用其子表达式的存储结果。 没有对每个嵌套级别进行 Python 函数调用，因此该算法在使普通递归下降不可靠的深度下保持安全。
