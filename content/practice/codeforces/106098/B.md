---
title: "CF 106098B - Farouk 和密码"
description: "我们从一个字符串开始，每当 $$i oplus j < min(i,j)$$ 时，可以在位置 i 和 j 之间重复交换字符，其中位置从 1 开始编号。该操作可以应用任意次。"
date: "2026-06-25T11:54:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106098
codeforces_index: "B"
codeforces_contest_name: "The American University in Cairo CSEA Fall 2025 contest"
rating: 0
weight: 106098
solve_time_s: 48
verified: true
draft: false
---

[CF 106098B - Farouk 和密码](https://codeforces.com/problemset/problem/106098/B)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个字符串开始，可能会在位置之间重复交换字符`i`和`j`每当$$i \oplus j < \min(i,j)$$其中位置从 1 开始编号。 

该操作可以应用任意多次。 在通过这些交换可到达的所有字符串中，我们必须输出字典顺序最小的字符串。 

输入包含多个测试用例。 每个测试用例都是一个小写字符串。 所有测试用例的总长度最多为$2 \cdot 10^5$。 任何接近二次时间的解都会太慢，而$O(n \log n)$解决方案很容易足够快。 

主要困难是了解哪些位置可以交换角色。 该条件涉及 XOR，因此直接模拟掉期是不现实的。 

一个常见的错误是认为只有直接可互换的头寸才重要。 可达性取决于执行多次交换，因此我们实际上需要交换图的连接组件。 

考虑字符串：```
dog
```位置 2 和 3 满足条件，因为：```
2 xor 3 = 1 < 2
```所以`o`和`g`可以交换，产生：```
dgo
```仅检查整个字符串是否可以排序的解决方案将错误地返回`dgo`对于许多不相关的案件。 

另一个微妙的情况是：```
abcdefgh
```位置 1 和位置 2 无法连接。 位置 1 形成其自己的组件，位置 2 和 3 形成另一个组件，位置 4 到 7 形成另一个组件。 即使整个字符串已经排序，它保持不变的原因是字符不能跨组件边界移动。 

## 方法

 蛮力方法会构建一个位置图。 对于每对`(i,j)`，我们检查交换条件是否成立并添加一条边。 然后我们找到连接的组件并对每个组件内的字符进行排序。 

这是正确的，因为任何连接的组件都允许通过一系列交换来任意重新排列其字符。 问题是图的构造。 有$O(n^2)$位置对，大致变成$4 \cdot 10^{10}$检查何时$n = 2 \cdot 10^5$。 那是完全不可行的。 

关键的观察结果是 XOR 条件具有非常简单的结构。 

取两个索引`i < j`。 

如果`i`和`j`具有相同的最高设置位，则两者都位于区间内$$[2^k,\;2^{k+1}-1].$$他们的异或删除了最高位，所以$$i \oplus j < 2^k \le i.$$因此交换是允许的。 

如果它们的最高设置位不同，则`j`最高位大于`i`。 该位保留在 XOR 结果中，给出$$i \oplus j \ge 2^m > i,$$所以条件失败。 

因此，当且仅当两个位置具有相同的最高有效位时，它们才可以直接交换。 

这意味着每个间隔$$[1,1],\ [2,3],\ [4,7],\ [8,15], \ldots$$形成一个完全连通分量，不同区间之间没有边。 

一旦知道了这个结构，就很容易构造按字典顺序最小的可达字符串。 对于每个组件，收集其字符，对它们进行排序，然后按递增的索引顺序将排序后的字符放回组件位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力图构建 | O(n²) | O(n²) | 太慢了|
 | 按 MSB 块对元件进行排序 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取字符串。 
2. 将位置分割成具有相同最高设置位的块。 

这些块正是：```
[1,1]
[2,3]
[4,7]
[8,15]
...
```当它们超过字符串长度时被截断。 
3. 对于每个块，收集当前位于这些位置的字符。 
4. 对收集到的字符进行排序。 

由于块内的每一对位置都可以直接交换，因此块的任何排列都是可以实现的。 
5. 将排序后的字符从左到右放回块位置。 

为了按字典顺序最小化整个字符串，最小的可用字符必须占据组件中的最小位置，下一个最小的字符必须占据下一个位置，依此类推。 
6. 处理完所有块后，输出结果字符串。 

### 为什么它有效

 当两个索引共享相同的最高设置位时，它们恰好属于同一个连接组件。 在这样的组件内，每对顶点都通过一条边连接，因此组件字符的任何排列都是可到达的。 

角色永远不能从一个组件跨越到另一个组件，因为组件之间没有边。 因此，问题分解为独立的块。 

对于固定块，字典顺序上的最佳排列将其字符按排序顺序放置在块的位置上。 由于块是独立的并且位置是从左到右处理的，因此组合这些局部最优排列给出了全局字典顺序最小的可达字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
ans = []

for _ in range(t):
    s = list(input().strip())
    n = len(s)

    res = s[:]

    start = 1
    while start <= n:
        end = min(n, 2 * start - 1)

        idxs = list(range(start - 1, end))
        chars = sorted(res[i] for i in idxs)

        for i, ch in zip(idxs, chars):
            res[i] = ch

        start *= 2

    ans.append("".join(res))

sys.stdout.write("\n".join(ans))
```该解决方案独立处理每个 MSB 块。 

变量`start`表示基于 1 的索引中块的第一个索引。 对应的块是$$[start,\;2 \cdot start - 1].$$例如：```
start = 1  -> [1,1]
start = 2  -> [2,3]
start = 4  -> [4,7]
start = 8  -> [8,15]
```最后一个块可能会超出字符串长度，因此我们将其截断为`min(n, 2 * start - 1)`。 

在访问 Python 列表之前，位置会转换为基于 0 的索引。 

对块的字符进行排序给出了该组件内按字典顺序排列的最小排列。 按索引顺序将它们写回即可实现这种安排。 

因为所有测试用例的总长度最多为$2 \cdot 10^5$，总分拣工作保持在限制范围内。 

## 工作示例

 ### 示例 1

 输入：```
dog
```组成部分是：```
[1]
[2,3]
```| 块| 之前的人物 | 已排序 | 之后的字符 |
 | --- | --- | --- | --- |
 | [1] | d | d | d |
 | [2,3]| 克 | 去吧| 去吧|

 结果：```
dgo
```此示例表明只有位置 2 和 3 可以交换字符。 

### 示例 2

 输入：```
goodpassword
```组成部分是：```
[1]
[2,3]
[4,7]
[8,12]
```| 块| 之前的人物 | 已排序 |
 | --- | --- | --- |
 | [1] | 克| 克|
 | [2,3]| 哦| 哦|
 | [4,7]| d pa s | d p s |
 | [8,12] | 剑| d 或 s w |

 重建字符串给出：```
gooadpsdorsw
```这表明角色可以在块内自由移动，但不能在不同块之间自由移动。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对所有组件的字符进行排序 |
 | 空间| O(n) | 输出数组和临时字符存储|

 总输入大小最多为$2 \cdot 10^5$，所以一个$O(n \log n)$解决方案可轻松满足 1 秒竞争性编程限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        s = list(input().strip())
        n = len(s)

        res = s[:]

        start = 1
        while start <= n:
            end = min(n, 2 * start - 1)

            idxs = list(range(start - 1, end))
            chars = sorted(res[i] for i in idxs)

            for i, ch in zip(idxs, chars):
                res[i] = ch

            start *= 2

        out.append("".join(res))

    return "\n".join(out)

# provided samples
assert run("4\ndog\nabcdefgh\ngoodpassword\nonetwothreefour\n") == \
       "dgo\nabcdefgh\ngooadpsdorsw\noenottweefhorru"

# minimum size
assert run("1\na\n") == "a"

# block [2,3]
assert run("1\ncba\n") == "cab"

# all equal
assert run("1\naaaaaaa\n") == "aaaaaaa"

# full block sorting inside [4,7]
assert run("1\nabcdgfed\n") == "abcdefgd"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`a`| 最小长度|
 |`cba`|`cab`| 仅在块内交换`[2,3]`|
 |`aaaaaaa`|`aaaaaaa`| 所有相同的字符|
 |`abcdgfed`|`abcdefgd`| 块内排序`[4,7]`仅|

 ## 边缘情况

 考虑：```
1
ab
```位置1属于块`[1]`,位置2属于块`[2,3]`。 它们位于不同的组件中，因此不可能交换。 

该算法分别处理两个块：```
[1] -> a
[2] -> b
```输出仍然是：```
ab
```现在考虑：```
1
cba
```这些块是：```
[1]
[2,3]
```中的人物`[2,3]`是`b`和`a`。 对它们进行排序给出`a b`。 

结果字符串是：```
cab
```尝试对整个字符串进行排序的解决方案将错误地产生`abc`，这是无法到​​达的。 

最后，考虑：```
1
hgfedcba
```这些块是：```
[1]
[2,3]
[4,7]
[8]
```该算法仅在每个块内部进行排序：```
[1]      -> h
[2,3]    -> f g
[4,7]    -> b c d e
[8]      -> a
```结果：```
hfgbcdea
```字符不能在块之间移动，因此这是真正的字典顺序最小可达字符串。
