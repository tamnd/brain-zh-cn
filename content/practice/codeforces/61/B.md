---
title: "CF 61B - 努力工作"
description: "我们得到了三个原始字符串。 如果学生的答案可以通过以任意顺序连接这三个字符串而形成，并且忽略两种差异，则该答案被认为是正确的。 第一个区别是字母大小写。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "strings"]
categories: ["algorithms"]
codeforces_contest: 61
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 57 (Div. 2)"
rating: 1300
weight: 61
solve_time_s: 395
verified: true
draft: false
---

[CF 61B - 努力工作](https://codeforces.com/problemset/problem/61/B)

 **评分：** 1300
 **标签：** 字符串
 **求解时间：** 6m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三个原始字符串。 如果学生的答案可以通过以任意顺序连接这三个字符串而形成，并且忽略两种差异，则该答案被认为是正确的。 

第一个区别是字母大小写。 同一字母的大写和小写版本应视为相同。 

第二个区别是特殊字符的存在`-`,`;`， 和`_`。 这些字符被完全忽略。 学生可以插入额外的、删除现有的或将它们放置在任何地方。 

对于每个学生的答案，我们必须打印`ACC`如果清理后的答案与三个清理后的原始字符串的某些排列相匹配。 否则我们打印`WA`。 

限制很小。 每个原始字符串的长度最多为 100，并且只有 3 个。 每个学生答案的长度最多为 600，答案最多为 1000 个。 即使直接尝试所有排列的方法也足够快，因为只有`3! = 6`可能的订单。 

棘手的部分不是性能，而是标准化。 粗心的实现可能会比较原始字符串并拒绝仅因忽略的字符或大小写而不同的答案。 

考虑这个例子：```
Original strings:
Ab
Cd
Ef

Student answer:
__efABcd;;
```正确的结果是`ACC`因为去掉符号并转换为小写后，答案就变成了`efabcd`，这正是一个有效的串联。 

另一个常见的错误是忘记原始字符串内的符号也必须被忽略。```
Original strings:
A_B
C
D

Student answer:
abcd
```正确的输出是`ACC`。 如果我们只清理学生的答案而不清理原始字符串，我们会错误地期望`a_bd`而不是`ab`。 

另一种微妙的情况是部分匹配。```
Original strings:
ab
cd
ef

Student answer:
abcdefg
```这必须是`WA`。 即使答案包含有效的串联作为前缀，整个清理后的字符串也必须完全匹配。 

## 方法

 最直接的想法是生成三个字符串的每种可能的串联顺序，对每个字符串进行标准化，然后将每个学生的答案与这些有效结果进行比较。 

由于只有三个字符串，因此正好有六种排列。 对于每个排列，我们连接字符串，删除所有符号，并将所有内容转换为小写。 然后，每个学生的答案都以相同的方式标准化，并对照六个有效字符串进行检查。 

这种暴力的方式已经是完全可以接受的了。 工作量很小：

 - 六种排列。 
- 清洗前每个连接字符串的长度最多为 300。 
- 最多 1000 个学生答案。 

总操作量远低于几百万个字符操作。 

关键的观察结果是订单数量是固定的并且非常小。 如果字符串的数量很大，则生成所有排列都会因阶乘而爆炸。 这里，`3!`只有 6，因此预先计算所有有效的标准化串联是最简单、最干净的解决方案。 

稍微简洁的版本将六个有效的标准化字符串存储在一个集合中。 然后每个查询在标准化后就变成了一个恒定时间的成员资格检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 通过直接按查询检查所有排列来进行暴力破解 | O(6 × L × n) | O(6 × L × n) | O(1) | O(1) | 已接受 |
 | 预先计算归一化集的最优 | O(6 × L + n × L) | O(6 × L + n × L) | O(1) | O(1) | 已接受 |

 这里，`L`表示标准化涉及的最大字符串长度。 

## 算法演练

 1. 读取三个原始字符串。 
2. 定义标准化函数。 

此函数删除所有出现的`-`,`;`， 和`_`，然后将其余字母转换为小写。 当两个字符串的标准化形式相等时，它们被认为完全相等。 
3. 生成三个字符串的所有六种排列。 

对于每个排列，按该顺序连接字符串并对结果进行标准化。 
4. 将所有规范化串联存储在一个集合内。 

使用集合可以快速进行成员资格检查并自动避免重复条目。 
5. 阅读每个学生的答案。 
6. 使用相同的归一化函数对学生的答案进行归一化。 

对原始数据和答案使用相同的处理可以保证公平比较。 
7. 检查有效串联集中是否存在规范化答案。 

如果存在则打印`ACC`。 否则打印`WA`。 

### 为什么它有效

 规范化函数消除了该语句告诉我们要忽略的所有区别。 标准化后，当问题规则认为两个字符串相等时，它们完全相等。 

每个有效答案必须对应于三个原始字符串的六种可能的串联顺序之一。 由于我们事先生成并标准化了所有六种可能性，因此该集合包含每个正确答案，仅此而已。 

当且仅当其规范化形式与这些规范化有效串联之一匹配时，学生的答案才会被接受。 

## Python 解决方案```python
import sys
from itertools import permutations

input = sys.stdin.readline

def normalize(s):
    res = []
    
    for ch in s:
        if ch not in "-;_":
            res.append(ch.lower())
    
    return "".join(res)

def solve():
    arr = [input().strip() for _ in range(3)]

    valid = set()

    for p in permutations(arr):
        combined = p[0] + p[1] + p[2]
        valid.add(normalize(combined))

    n = int(input())

    for _ in range(n):
        ans = normalize(input().strip())

        if ans in valid:
            print("ACC")
        else:
            print("WA")

solve()
```这`normalize`功能是解决方案的核心。 它删除所有被忽略的符号并将字母转换为小写。 对原始字符串和学生答案使用相同的函数可以防止不一致。 

排列是使用生成的`itertools.permutations`。 由于只有三个字符串，因此这正好产生六个订单。 

有效的标准化串联存储在一个集合中。 集合中的成员资格测试非常高效并且保持检查逻辑简单。 

一个微妙的实现细节是用`.strip()`加工前。 忘记这一点会留下尾随`\n`字符串内的字符并中断比较。 

另一个重要的细节是清理原始字符串和答案。 该声明允许标志出现在两者的任何地方。 

## 工作示例

 ### 示例 1

 输入：```
Iran_
Persian;
W_o;n;d;e;r;f;u;l;
WonderfulPersianIran
```标准化后：

 | 步骤| 价值|
 | ---| ---|
 | 原创 1 |`iran`|
 | 原创 2 |`persian`|
 | 原创 3 |`wonderful`|
 | 学生回答|`wonderfulpersianiran`|

 一种有效的排列是：

 | 排列| 标准化结果 |
 | ---| ---|
 | 精彩+波斯+伊朗|`wonderfulpersianiran`|

 学生的标准化答案与有效的标准化串联匹配，因此输出为：```
ACC
```此示例演示了符号在任何地方都被忽略，包括在原始字符串内。 

### 示例 2

 输入：```
ab
cd
ef
abcdefg
```标准化在这里没有改变任何东西。 

| 步骤| 价值|
 | ---| ---|
 | 有效的串联示例 |`abcdef`|
 | 学生回答|`abcdefg`|

 答案包含一个额外的字符`g`，因此它不完全匹配任何有效的串联。 

输出：```
WA
```此示例确认标准化后的比较必须准确，而不是基于子字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n × L) | 每个答案都标准化一次，并且只预先计算六个有效字符串 |
 | 空间| O(L) | 该集合最多存储六个标准化串联 |

 这里，`L`是连接后的最大字符串长度。 由于总输入大小非常小，因此该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import permutations

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def normalize(s):
        res = []

        for ch in s:
            if ch not in "-;_":
                res.append(ch.lower())

        return "".join(res)

    arr = [input().strip() for _ in range(3)]

    valid = set()

    for p in permutations(arr):
        valid.add(normalize(p[0] + p[1] + p[2]))

    n = int(input())

    out = []

    for _ in range(n):
        ans = normalize(input().strip())

        if ans in valid:
            out.append("ACC")
        else:
            out.append("WA")

    return "\n".join(out)

# provided sample
assert run(
"""Iran_
Persian;
W_o;n;d;e;r;f;u;l;
7
WonderfulPersianIran
wonderful_PersIAN_IRAN;;_
WONDERFUL___IRAN__PERSIAN__;;
Ira__Persiann__Wonderful
Wonder;;fulPersian___;I;r;a;n;
__________IranPersianWonderful__________
PersianIran_is_Wonderful
"""
) == "\n".join([
    "ACC",
    "ACC",
    "ACC",
    "WA",
    "ACC",
    "ACC",
    "WA"
]), "sample 1"

# minimum-size strings
assert run(
"""a
b
c
2
abc
acb
"""
) == "\n".join([
    "ACC",
    "ACC"
]), "minimum size"

# case insensitivity
assert run(
"""Ab
Cd
Ef
2
abcdef
EFABCD
"""
) == "\n".join([
    "ACC",
    "ACC"
]), "case handling"

# ignored signs
assert run(
"""a_b
c;d
-e
2
abcde
ab_cd_e
"""
) == "\n".join([
    "ACC",
    "ACC"
]), "sign removal"

# incorrect extra character
assert run(
"""ab
cd
ef
1
abcdefg
"""
) == "WA", "extra characters must fail"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a b c`和`abc`和`acb`|`ACC ACC`| 最小尺寸有效排列 |
 | 混合大写答案 |`ACC`| 不区分大小写的比较 |
 | 包含符号 | 的字符串`ACC`| 正确删除被忽略的字符 |
 | 额外的尾随字符 |`WA`| 归一化后精确匹配 |

 ## 边缘情况

 考虑被忽略的符号出现在原始字符串内的情况。```
Input:
A_B
C
D
1
abcd
```该算法将原始数据归一化为：```
ab
c
d
```一个生成的串联变为`abcd`。 学生的回答也正常化为`abcd`，所以输出是：```
ACC
```这是有效的，因为归一化是对称应用于两侧的。 

现在考虑混合套管。```
Input:
Ab
Cd
Ef
1
eFaBcD
```有效排列`Ef + Ab + Cd`标准化为：```
efabcd
```学生的答案也归一化为：```
efabcd
```设置查找成功，因此答案被接受。 

最后，考虑带有额外字符的近似匹配。```
Input:
ab
cd
ef
1
abcdefx
```有效的规范化字符串的长度均为 6。学生的规范化答案的长度为 7：```
abcdefx
```由于该算法比较完整的标准化字符串，而不是前缀，因此答案会被正确拒绝：```
WA
```
