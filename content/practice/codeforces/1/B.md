---
title: "CF 1B - 电子表格"
description: "该任务给出以两种格式之一编写的电子表格单元格坐标，对于每个坐标，我们必须将其转换为另一种格式。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 1"
rating: 1600
weight: 1
solve_time_s: 295
verified: true
draft: false
---
## 问题理解

 该任务给出以两种格式之一编写的电子表格单元格坐标，对于每个坐标，我们必须将其转换为另一种格式。 

第一种格式是常见的 Excel 样式符号。 列是用字母书写的，行号紧随其后。 例如，`BC23`表示列`BC`和行`23`。 棘手的部分是该列的行为类似于没有零数字的 26 进制计数系统。`A = 1`,`B = 2`, ...,`Z = 26`,`AA = 27`， 等等。 

第二种格式写入相同的信息`R<row>C<column>`。 例如，`R23C55`表示行`23`， 柱子`55`。 

对于每个输入字符串，我们首先确定它使用哪种表示法，然后将其转换为其他表示法。 

约束足够大，效率很重要。 最多可以有`10^5`坐标，每个坐标可以代表高达`10^6`。 对于大范围逐字符重复模拟电子表格编号的解决方案会太慢。 我们需要输入字符串的长度接近线性。 由于每个坐标都很短，`O(length)`每个查询的转换很容易足够快。 

主要困难是正确识别格式。 像“开始于`R`” 失败，因为有效的 Excel 样式坐标也可以以`R`。 例如：```
R23C55
```是在`RXCY`格式，但是```
RC23
```实际上是 Excel 风格的表示法，因为`RC`是列名称，并且`23`是行。 

粗心的解析器可能会错误地分类`RC23`作为`RXCY`因为它开始于`R`并包含`C`。 正确的规则更严格：在领先之后`R`，必须至少有一位数字，然后是`C`，然后再次至少一位数字。 

错误的另一个常见来源是电子表格列转换本身。 电子表格列不是标准的基数 26，因为没有零数字。 例如：```
26 -> Z
27 -> AA
52 -> AZ
53 -> BA
```如果我们直接使用`% 26`无需调整这个缺失的零位，`26`错误地变成`BA`而不是`Z`。 

## 方法

 暴力的想法是按顺序显式生成电子表格列名称：```
A, B, C, ..., Z, AA, AB, ...
```并在达到所要求的列号后停止。 使用位置算术将字母转换回数字很容易，但是通过生成前面的每一列来将数字转换为字母很快就变得不切实际。 

假设我们需要列`10^6`。 即使每个生成的标签都需要恒定的时间，我们仍然会为单个查询执行大约一百万次迭代。 和`10^5`查询，这会爆炸到大约`10^11`的操作，远远超出了可接受的限度。 

关键的观察结果是电子表格列形成了位置数字系统。 唯一不寻常的部分是数字范围从`1`到`26`而不是`0`到`25`。 

这意味着我们可以直接在两种表示之间进行数学转换。 

要将字母转换为数字，我们像基数转换一样处理字符串：```
ABC = 1 * 26^2 + 2 * 26^1 + 3
```为了将数字转换回字母，我们使用模运算重复提取最后一位数字。 因为没有零位，所以我们在取之前先减一`% 26`。 

对于格式检测，我们扫描字符串并检查它是否匹配：```
R + digits + C + digits
```如果是这样，我们从`RXCY`到 Excel 样式。 否则，我们将向相反方向转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(列值) | O(1) | O(1) | 太慢了 |
 | 最佳 | 每个查询的 O(字符串长度) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取坐标字符串。 
2.确定其格式。 

一个字符串在`RXCY`格式如果：

 - 它开始于`'R'`- 后`'R'`至少有一位数字
 - 在这些数字之后有一个`'C'`- 后`'C'`至少有一位数字

 这可以避免对字符串进行错误分类，例如`RC23`。 
3. 如果字符串是 Excel 样式：

 将其分为两部分：

 - 前导字母，代表列
 - 尾随数字，代表行
 4. 将列字母转换为数字。 

从左到右处理每个字母：```
value = value * 26 + letter_value
```在哪里`A = 1`,`B = 2`, ...,`Z = 26`。 
5、输出结果为：```
R<row>C<column_number>
```6. 如果字符串已经存在`RXCY`格式：

 提取行号和列号。 
7. 将列号转换为电子表格字母。 

反复：

 - 从数字中减去 1
 - 采取`% 26`获取当前字母
 - 除以 26 进行下一步

 减法是必要的，因为电子表格列是 1 索引而不是 0 索引。 
8. 反转收集的字母，因为转换会从最低有效数字到最高有效数字构建字符串。 
9. 输出：```
<column_letters><row>
```### 为什么它有效

 该算法依赖于这样一个事实：电子表格列的行为与具有基数 26 和数字的位置数字系统完全相同`1..26`。 

将字母转换为数字时，每一步都会将当前值移动一个以 26 为基数的位置并添加下一个数字。 这与普通的十进制解析相同。 

将数字转换回字母时，减一会改变范围`1..26`纳入标准`0..25`模运算所需的范围。 每次迭代都会准确提取一个 26 进制数字，因此生成的字母唯一地代表原始列号。 

格式检测规则保证每个输入都被正确分类，因为两种格式在结构上不同。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_rxcy(s):
    if not s or s[0] != 'R':
        return False

    i = 1

    if i >= len(s) or not s[i].isdigit():
        return False

    while i < len(s) and s[i].isdigit():
        i += 1

    if i >= len(s) or s[i] != 'C':
        return False

    i += 1

    if i >= len(s):
        return False

    while i < len(s):
        if not s[i].isdigit():
            return False
        i += 1

    return True

def letters_to_number(col):
    value = 0

    for ch in col:
        value = value * 26 + (ord(ch) - ord('A') + 1)

    return value

def number_to_letters(num):
    result = []

    while num > 0:
        num -= 1
        result.append(chr(num % 26 + ord('A')))
        num //= 26

    return ''.join(reversed(result))

def solve():
    n = int(input())
    ans = []

    for _ in range(n):
        s = input().strip()

        if is_rxcy(s):
            c_pos = s.index('C')

            row = s[1:c_pos]
            col_num = int(s[c_pos + 1:])

            col_letters = number_to_letters(col_num)

            ans.append(col_letters + row)

        else:
            i = 0

            while s[i].isalpha():
                i += 1

            col_letters = s[:i]
            row = s[i:]

            col_num = letters_to_number(col_letters)

            ans.append(f"R{row}C{col_num}")

    print('\n'.join(ans))

solve()
```该解决方案将问题分为三个独立的部分：格式检测、从字母到数字的转换以及从数字到字母的转换。 

这`is_rxcy`函数比简单的模式检查更严格。 它显式验证所需的结构：```
R + digits + C + digits
```这可以防止错误匹配，例如`RC23`。 

这`letters_to_number`函数执行普通的位置解析。 每个新字符都会将当前值移动一位以 26 为基数的位置，并添加下一个数字值。 

反向转换更加微妙。 电子表格列不是零索引的，因此在获取之前`% 26`我们从当前数字中减一。 如果没有这个调整：```
26 % 26 = 0
```会错误地映射`26`到`'A'`而不是`'Z'`。 

转换自然会从右到左构建字符，因此我们最后反转结果。 

除了输出列表之外，该实现仅使用恒定的额外内存，并且每个字符都被处理恒定的次数。 

## 工作示例

 ### 示例 1

 输入：```
R23C55
```#### 追踪

 | 步骤| 变量| 价值|
 | --- | --- | --- |
 | 检测格式 | 是_rxcy | 真实|
 | 提取行 | 行|`"23"`|
 | 提取栏 | 列号 |`55`|
 | 第一次迭代 | 编号 |`55 -> 54`|
 | 第一个字母 | 54% 26 |`2 -> 'C'`|
 | 剩余数量 | 54//26|`2`|
 | 第二次迭代 | 编号 |`2 -> 1`|
 | 第二封信 | 1% 26 |`1 -> 'B'`|
 | 最终结果| 反转字母|`"BC"`|

 输出：```
BC23
```该迹线显示了为什么需要在模数之前减一。 没有它，列`55`无法正确映射到`BC`。 

### 示例 2

 输入：```
BC23
```#### 追踪

 | 步骤| 变量| 价值|
 | --- | --- | --- |
 | 检测格式 | 是_rxcy | 假 |
 | 分割字符串| col_letters |`"BC"`|
 | 分割字符串| 行|`"23"`|
 | 过程`'B'`| 价值|`0 * 26 + 2 = 2`|
 | 过程`'C'`| 价值|`2 * 26 + 3 = 55`|
 | 最终栏数 | 列号 |`55`|

 输出：```
R23C55
```这演示了电子表格列的位置解释。`BC`其行为与两位 26 进制数字完全相同。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总输入长度) | 每个字符都会被处理固定次数 |
 | 空间| O(1) 辅助 | 转换过程中只使用了几个变量 |

 即使与`10^5`坐标，处理的文本总量较小。 该算法很容易满足时间限制，因为每个查询只需要直接解析和算术。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_io(inp: str) -> str:
    input_stream = io.StringIO(inp)
    output_stream = io.StringIO()

    input = input_stream.readline

    def is_rxcy(s):
        if not s or s[0] != 'R':
            return False

        i = 1

        if i >= len(s) or not s[i].isdigit():
            return False

        while i < len(s) and s[i].isdigit():
            i += 1

        if i >= len(s) or s[i] != 'C':
            return False

        i += 1

        if i >= len(s):
            return False

        while i < len(s):
            if not s[i].isdigit():
                return False
            i += 1

        return True

    def letters_to_number(col):
        value = 0

        for ch in col:
            value = value * 26 + (ord(ch) - ord('A') + 1)

        return value

    def number_to_letters(num):
        result = []

        while num > 0:
            num -= 1
            result.append(chr(num % 26 + ord('A')))
            num //= 26

        return ''.join(reversed(result))

    n = int(input())
    ans = []

    for _ in range(n):
        s = input().strip()

        if is_rxcy(s):
            c_pos = s.index('C')

            row = s[1:c_pos]
            col_num = int(s[c_pos + 1:])

            ans.append(number_to_letters(col_num) + row)

        else:
            i = 0

            while s[i].isalpha():
                i += 1

            col = s[:i]
            row = s[i:]

            ans.append(f"R{row}C{letters_to_number(col)}")

    output_stream.write('\n'.join(ans))
    return output_stream.getvalue()

# provided samples
assert solve_io(
    "2\nR23C55\nBC23\n"
) == "BC23\nR23C55", "sample 1"

# minimum values
assert solve_io(
    "1\nA1\n"
) == "R1C1", "minimum coordinate"

# boundary around Z -> AA
assert solve_io(
    "3\nZ1\nAA1\nR1C26\n"
) == "R1C26\nR1C27\nZ1", "base-26 transition"

# tricky parsing case
assert solve_io(
    "1\nRC23\n"
) == "R23C471", "must not classify as RXCY"

# larger column values
assert solve_io(
    "2\nR999C702\nZZ999\n"
) == "ZZ999\nR999C702", "double-letter boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A1`|`R1C1`| 最小有效坐标|
 |`Z1`,`AA1`,`R1C26`| 正确的过渡 | 26 进制转换中的差一处理
 |`RC23`|`R23C471`| 正确格式检测 |
 |`R999C702`|`ZZ999`| 多字母转换正确性 |

 ## 边缘情况

 一个特别危险的情况是：```
RC23
```弱解析器可能会将其视为`RXCY`格式，因为它开头为`R`并包含`C`。 该算法立即检查数字`R`。 由于第二个字符是`C`，该模式失败，因此该字符串被正确视为 Excel 样式表示法。 

转换过程如下：```
R = 18
C = 3
18 * 26 + 3 = 471
```最终输出变为：```
R23C471
```另一个棘手的边界是列`26`。 

输入：```
R1C26
```转换期间：

 | 迭代| 之前 | 编号 减去后的数字 | 余数 | 信|
 | --- | --- | --- | --- | --- |
 | 1 | 26 | 26 25 | 25 25 | 25 Z|

 该算法输出：```
Z1
```如果我们跳过减法步骤，`% 26`会产生`0`，导致错误的映射。 

过渡从`Z`到`AA`是另一个经典的一对一陷阱。 

输入：```
R1C27
```追踪：

 | 迭代| 之前 | 编号 减去后的数字 | 余数 | 信|
 | --- | --- | --- | --- | --- |
 | 1 | 27 | 27 26 | 26 0 | 一个 |
 | 2 | 1 | 0 | 0 | 一个 |

 反转收集到的字母可以得出：```
AA1
```这证实了编号系统的行为类似于 1 索引的基数 26，而不是标准的基数 26。
