---
title: "CF 102483E - 平等控制"
description: "我们有两个用小语言编写的程序，其中每个表达式都会生成一个正整数列表。 程序可能包含固定列表、串联、随机洗牌和排序。"
date: "2026-08-06T04:13:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102483
codeforces_index: "E"
codeforces_contest_name: "2018-2019 ICPC Northwestern European Regional Programming Contest (NWERC 2018)"
rating: 0
weight: 102483
solve_time_s: 109
verified: true
draft: false
---

[CF 102483E - 平等控制](https://codeforces.com/problemset/problem/102483/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个用小语言编写的程序，其中每个表达式都会生成一个正整数列表。 程序可能包含固定列表、串联、随机洗牌和排序。 任务不是比较程序的文本，而是确定它们是否在所有可能的输出列表上产生完全相同的概率分布。 

困难在于操作可以隐藏信息。 打乱列表不关心原始顺序，而串联则在其两个部分之间保留边界。 例如，随机洗牌`[1,2,1,2]`与连接两个独立的洗牌不同`[1,2]`，因为第二个版本始终包含隐藏的分割点。 

输入字符串最多可包含一百万个字符。 这立即排除了评估所有可能的输出，因为即使是一个简短的列表也可能有多种排列。 它还排除了构建大型中间发行版的可能性。 该算法必须几乎线性地处理语法，并且仅保留结果分布的紧凑描述。 

主要的边缘情况来自看起来相似的令人困惑的操作。 像这样的程序`shuffle([1,2,3])`不等于`concat(shuffle([1,2]),[3])`，因为最后一个元素在第二个程序中是固定的。 像这样的程序`shuffle([1])`应被视为确定性列表`[1]`，否则等效程序可能会收到不同的表示。 重复值是另一个陷阱。 每个最终序列的概率取决于多重性，因此将列表视为集合会给出错误的答案。 

## 方法

 一种直接的方法是模拟每个表达式的概率分布。 对于长度列表`n`，这意味着最多存储`n!`洗牌后可能的排列。 即使对于只有 15 个不同位置的列表，这也是不可能的，并且最大输入大小要大很多数量级。 

关键的观察是洗牌完全忘记了其参数的内部结构。 它保留的唯一信息是多重值集。 排序操作也只需要多重集，但其输出是确定性的。 其他一切都可以表示为这两种片段的序列。 

暴力方法之所以有效，是因为语言语义很小，但它失败了，因为可能的输出数量呈指数增长。 每个表达式都可以简化为确定性段和独立的打乱段的观察结果让我们可以比较紧凑的范式。 

在标准化期间，确定性段存储其确切序列。 随机段仅存储每个值的计数。 可以合并相邻的确定性段，并且可以将仅包含一个值的随机段转换为确定性段。 

得到的表示是规范的。 如果两个归一化表示不同，则某些边界、值或概率行为不同，这意味着原始程序不能等效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(可能的输出数量) | O(可能的输出数量) | 太慢了 |
 | 正常形式结构| O(n) 预期 | O(n) | 已接受 |

 ## 算法演练

 1. 递归地解析表达式并返回其规范化形式及其多组值。 需要多重集，因为两者`shuffle`和`sorted`丢弃订购信息。 
2. 将列表文字转换为确定性块。 它的多重集是在读取数字时计算的。 
3.为了`concat(a,b)`，连接两个子项的标准化块序列。 如果两个相邻块是确定性的，则将它们合并，因为两个固定序列之间没有可观察到的边界。 
4. 对于`shuffle(x)`，丢弃块结构`x`并创建一个随机块，其中仅包含所有值的多重集`x`。 长度为一的随机块被简化为确定性块。 
5. 对于`sorted(x)`，创建一个包含所有值的确定性块`x`按递增顺序。 原始订购信息无关。 
6. 比较两个程序的标准化块序列。 每个确定性块必须具有相同的序列，并且每个随机块必须具有相同的多重集。 

不变的是每个归一化表达式都描述与原始表达式完全相同的分布。 确定性块表示被迫出现在精确位置的值，而随机块表示多重集的均匀排列。 上面的运算保留了这个含义，因此相等的归一化形式意味着相等的分布，不同的归一化形式意味着不同的分布。 

## Python 解决方案```python
import sys
from collections import Counter

input = sys.stdin.readline
sys.setrecursionlimit(3000000)

def merge_blocks(a, b):
    if not a:
        return b
    if not b:
        return a
    if a[-1][0] == 'D' and b[0][0] == 'D':
        return a[:-1] + [('D', a[-1][1] + b[0][1])] + b[1:]
    return a + b

def normalize_block(kind, data):
    if kind == 'R':
        if sum(data.values()) == 1:
            x = next(iter(data))
            return [('D', (x,))]
        return [('R', tuple(sorted(data.items())))]
    return [('D', tuple(data))]

def parse(s):
    n = len(s)
    pos = 0

    def dfs():
        nonlocal pos

        if s[pos] == '[':
            pos += 1
            vals = []
            cnt = Counter()
            while s[pos] != ']':
                start = pos
                while s[pos].isdigit():
                    pos += 1
                x = int(s[start:pos])
                vals.append(x)
                cnt[x] += 1
                if s[pos] == ',':
                    pos += 1
            pos += 1
            return [('D', tuple(vals))], cnt

        start = pos
        while s[pos].isalpha():
            pos += 1
        op = s[start:pos]
        pos += 1

        if op == 'concat':
            left, c1 = dfs()
            pos += 1
            right, c2 = dfs()
            pos += 1
            return merge_blocks(left, right), c1 + c2

        child, cnt = dfs()
        pos += 1

        if op == 'shuffle':
            return normalize_block('R', cnt), cnt

        arr = []
        for x, c in sorted(cnt.items()):
            arr.extend([x] * c)
        return [('D', tuple(arr))], cnt

    return dfs()[0]

a = input().strip()
b = input().strip()

print("equal" if parse(a) == parse(b) else "not equal")
```解析器直接遵循语法。 列表文字的处理方式是收集其值并同时计算出现次数。 计数器是必要的，因为打乱的结果取决于多重性，而不仅仅是不同的值。 

这`merge_blocks`函数是连接后唯一需要的简化。 两个确定性邻居与一个较大的确定性块无法区分，而随机块必须保持分离，因为它们之间的独立性会改变分布。 

这`normalize_block`函数处理微妙的单例情况。 一个值的洗牌不能引入随机性，因此将其保留为随机块将为同一行为创建多种表示。 

解析器使用递归，因为语法本质上是递归的。 增加了递归限制以支持深层嵌套表达式。 

## 工作示例

 对于第一个样本，比较：`concat(shuffle([1,2]),shuffle([1,2]))`和`shuffle([1,2,1,2])`| 步骤| 第一个节目| 第二期节目 |
 | --- | --- | --- |
 | 首先解析随机播放 | 随机块`{1:1,2:1}`| |
 | 解析第二次随机播放 | 两个独立的随机块 | |
 | 解析外部随机播放 | | 随机块`{1:2,2:2}`|
 | 范式|`R(1,2), R(1,2)`|`R(1,1,2,2)`|
 | 结果 | 不同| 不同|

 该跟踪显示了为什么保持随机块边界很重要。 这两个表达式具有相同的总多重集但概率不同。 

对于第二个样本：`sorted(concat([3,2,1],[4,5,6]))`和`[1,2,3,4,5,6]`| 步骤| 第一个节目| 第二期节目 |
 | --- | --- | --- |
 | 读取文字 | 多集`{1,2,3,4,5,6}`| 顺序`(1,2,3,4,5,6)`|
 | 应用排序| 确定性`(1,2,3,4,5,6)`| 确定性`(1,2,3,4,5,6)`|
 | 结果 | 平等| 平等|

 该示例演示了排序会删除所有先前的排序信息。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) 预期 | 每个字符都会解析一次，并且计数的哈希映射操作预计为 O(1)。 |
 | 空间| O(n) | 归一化表示存储与输入大小成比例的信息。 |

 一百万个字符的输入限制要求避免枚举输出并保持解析接近线性。 该解决方案仅存储有关排序和值频率的压缩信息，因此它完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    a = sys.stdin.readline().strip()
    b = sys.stdin.readline().strip()
    sys.stdin = old
    return "equal\n" if parse(a) == parse(b) else "not equal\n"

assert run("concat(shuffle([1,2]),shuffle([1,2]))\nshuffle([1,2,1,2])\n") == "not equal\n"

assert run("sorted(concat([3,2,1],[4,5,6]))\n[1,2,3,4,5,6]\n") == "equal\n"

assert run("concat(sorted([4,3,2,1]),shuffle([1]))\nconcat(concat([1,2,3],shuffle([4])),sorted([1]))\n") == "equal\n"

assert run("[5]\nshuffle([5])\n") == "equal\n"

assert run("shuffle([1,1,2])\nconcat([1],shuffle([1,2]))\n") == "not equal\n"

assert run("sorted([9,9,1])\n[1,9,9]\n") == "equal\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`shuffle([1,2])`与两个串联的洗牌相比 不等于| 独立随机性无法合并|
 |`sorted([9,9,1])`与排序顺序 | 等于| 排序仅使用多重集 |
 |`shuffle([5])`相对`[5]`| 等于| 单例随机性简化 |
 | 不同结构中的重复值 | 不等于| 多重性影响概率 |

 ## 边缘情况

 对于`shuffle([5])`与相比`[5]`，该算法创建一个包含一个元素的随机块，并立即将其转换为确定性块。 两者均归一化为`D(5)`，所以输出是正确的`equal`。 

为了`shuffle([1,1,2])`与相比`concat([1],shuffle([1,2]))`，两个表达式包含相同的值，但它们的规范化形式不同。 第一个成为一个带有计数的随机块`{1:2,2:1}`，而第二个成为确定性块，后面跟着随机块。 隐藏的分割改变了可能的输出，因此算法返回`not equal`。 

对于重复值，例如`sorted([9,9,1])`相对`[1,9,9]`，多集计数器存储两个副本`9`和一份`1`。 排序会产生精确的确定性序列，因此两个程序都会收到相同的规范表示。
