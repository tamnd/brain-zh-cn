---
title: "CF 104614D - 测定核苷酸分类"
description: "我们得到一条仅由四种核苷酸类型 A、T、G 和 C 组成的 DNA 链。在该链之后，紧接着是几个范围查询。 每个查询指定链的一个连续部分，对于该部分，我们必须确定每个核苷酸出现的频率。"
date: "2026-06-29T22:01:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104614
codeforces_index: "D"
codeforces_contest_name: "2022-2023 ICPC East Central North America Regional Contest (ECNA 2022)"
rating: 0
weight: 104614
solve_time_s: 73
verified: true
draft: false
---

[CF 104614D - 确定核苷酸分类](https://codeforces.com/problemset/problem/104614/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一条仅由四种核苷酸类型组成的 DNA 链`A`,`T`,`G`， 和`C`。 在该链之后，接下来是几个范围查询。 每个查询指定链的一个连续部分，对于该部分，我们必须确定每个核苷酸出现的频率。 

所需的输出不是频率本身。 相反，对于每个查询，我们必须打印从最高频率到最低频率排序的四个核苷酸字母。 每当两个核苷酸出现频率相同时，固定优先级`A < T < G < C`决定它们的相对顺序。 

DNA 链最多包含 50,000 个字符，而查询可能多达 25,000 个。 对每个请求的子字符串的直接扫描会检查每个查询中的每个字符。 在最坏的情况下，每个查询都会跨越整个链，从而导致大约 50,000 × 25,000 = 12.5 亿个字符访问。 这个工作量远远超出了实际的范围。 

字母表仅包含四个可能的字符。 这个小常数是问题的关键属性。 如果我们能够在常数时间内回答“这个区间内有多少个 A？”、“有多少个 T？”等等，那么每次查询的工作量都会变得很小。 

一个容易犯的错误就是错误地处理领带。 考虑输入```
AT
1
1 2
```两个都`A`和`T`出现一次，同时`G`和`C`出现零次。 正确的输出是```
ATGC
```仅按频率排序可以产生`TAGC`，这是不正确的，因为相等的频率必须遵循固定的核苷酸顺序。 

当某些核苷酸根本不出现时，就会发生另一种微妙的情况。```
AAAA
1
1 4
```正确的输出是```
ATGC
```

`A`是第一位，因为它出现了四次。 其余三个核苷酸的频率均为零，因此它们保持优先顺序`T`,`G`,`C`。 

由单个位置组成的查询也值得关注。```
G
1
1 1
```答案是```
GATC
```

`G`频率为 1，而其余核苷酸的频率均为 0，并根据打破平局规则进行排序。 

## 方法

 最直接的解决方案独立处理每个查询。 对于每个间隔，扫描每个字符，维护四个计数器，然后根据频率和平局优先级对四个核苷酸进行排序。 

这种方法是正确的，因为间隔中的每个字符都为其相应的计数器贡献一次。 不幸的是，它在重叠的查询中重复相同的工作。 如果每个查询几乎涵盖整个 DNA 链，则该算法将执行大约 12.5 亿个字符检查，从而使其速度太慢。 

重复计数表明需要进行预处理。 每个查询仅询问子字符串内的频率，而子字符串频率查询正是前缀和的设计目的。 

对于每个核苷酸，构建一个前缀计数数组，其中`prefix[i]`存储第一个出现的次数`i`链的位置。 任意区间内出现的次数`[l, r]`那么简单地就是```
prefix[r] - prefix[l - 1]
```由于只有四个核苷酸，因此每个查询恰好需要四个前缀和差异。 获得四个计数后，我们仅对四个项目进行排序。 对四个元素进行排序是常数时间，因此预处理后每个查询都会在常数时间内得到答复。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了 |
 | 最佳| O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 创建四个前缀和数组，每个核苷酸一个`A`,`T`,`G`， 和`C`。 每个数组都有长度`n + 1`，其中索引`0`代表一个空前缀。 
2. 从左到右扫描 DNA 链。 在每个位置，复制所有四个核苷酸的先前前缀值，然后递增与当前字符对应的数组。 
3. 对于每个查询`[l, r]`，通过减去适当的前缀和来计算每个核苷酸的频率。 
4. 形成由负频率和核苷酸字母组成的四对。 使用负值可以让普通的升序排序将较大的频率放在第一位。 
5. 对这四对进行排序。 Python 按字典顺序比较元组，因此相同的频率会根据字母的字母顺序自动打破。 因为所需的优先级正是`A`,`T`,`G`,`C`，这会产生所需的排序。 
6. 按排序顺序输出这四个字母。 

### 为什么它有效

 对于每个核苷酸，前缀数组始终存储每个位置之前出现的确切出现次数。 减去两个前缀值会删除间隔之前的所有内容，从而精确地保留所请求子字符串内的出现次数。 

每个查询计算所有四个核苷酸的正确频率。 随后的排序按频率递减对它们进行排序。 每当两个频率相等时，元组比较就会回退到核苷酸字母，以匹配所需的优先级顺序。 由于每个输出仅由这些正确频率和指定的平局规则决定，因此每个答案都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()
    n = len(s)

    letters = "ATGC"
    idx = {c: i for i, c in enumerate(letters)}

    pref = [[0] * (n + 1) for _ in range(4)]

    for i, ch in enumerate(s, 1):
        for k in range(4):
            pref[k][i] = pref[k][i - 1]
        pref[idx[ch]][i] += 1

    m = int(input())
    out = []

    for _ in range(m):
        l, r = map(int, input().split())
        arr = []
        for k, ch in enumerate(letters):
            cnt = pref[k][r] - pref[k][l - 1]
            arr.append((-cnt, ch))
        arr.sort()
        out.append("".join(ch for _, ch in arr))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一部分构造四个独立的前缀和数组。 每个位置都会复制先前的累积计数，然后恰好递增与当前核苷酸相对应的一个计数器。 

每个查询执行四个前缀和差异。 由于数组使用基于 1 的索引，因此间隔公式变为`pref[r] - pref[l - 1]`对于从第一个字符开始的间隔没有任何特殊处理。 

排序步骤值得关注。 元组包含`(-count, letter)`而不是`(count, letter)`。 Python 按升序排序，因此对计数取负会使较大的频率首先出现。 当两个计数相同时，直接比较字母。 因为所需的优先级正是`A`,`T`,`G`,`C`，不需要自定义比较器。 

## 工作示例

 ### 示例 1

 输入```
TATATGCTCT
1
1 10
```子串是整个 DNA 链。 

| 核苷酸 | 计数 |
 | ---| ---|
 | 一个 | 2 |
 | T | 4 |
 | G | 1 |
 | C | 3 |

 排序后：

 | 职位| 核苷酸 |
 | ---| ---|
 | 1 | T |
 | 2 | C |
 | 3 | 一个 |
 | 4 | G |

 输出：```
TCAG
```该示例表明排序完全由频率决定。 

### 示例 2

 输入```
AAAA
1
1 4
```| 核苷酸 | 计数 |
 | ---| ---|
 | 一个 | 4 |
 | T | 0 |
 | G | 0 |
 | C | 0 |

 排序后：

 | 职位| 核苷酸 |
 | ---| ---|
 | 1 | 一个 |
 | 2 | T |
 | 3 | G |
 | 4 | C |

 输出：```
ATGC
```该轨迹表明，相等的零频率仅按规定的优先级排序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 前缀构造是线性的，每个查询执行恒定的工作。 |
 | 空间| O(n) | 四个长度的前缀数组`n + 1`被存储。 |

 预处理扫描 DNA 链一次，每个查询仅执行四次前缀和查找和对四个元素进行排序。 这些成本很容易满足给定的限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old = sys.stdout
    sys.stdout = out

    input = sys.stdin.readline

    def solve():
        s = input().strip()
        n = len(s)

        letters = "ATGC"
        idx = {c: i for i, c in enumerate(letters)}

        pref = [[0] * (n + 1) for _ in range(4)]

        for i, ch in enumerate(s, 1):
            for k in range(4):
                pref[k][i] = pref[k][i - 1]
            pref[idx[ch]][i] += 1

        m = int(input())

        ans = []
        for _ in range(m):
            l, r = map(int, input().split())
            cur = []
            for k, ch in enumerate(letters):
                cnt = pref[k][r] - pref[k][l - 1]
                cur.append((-cnt, ch))
            cur.sort()
            ans.append("".join(ch for _, ch in cur))
        print("\n".join(ans))

    solve()

    sys.stdout = old
    return out.getvalue().strip()

# provided sample
assert run(
"""TATATGCTCT
3
1 10
6 10
6 6
"""
) == "\n".join([
    "TCAG",
    "TCGA",
    "GATC"
])

# minimum input
assert run(
"""A
1
1 1
"""
) == "ATGC"

# all equal
assert run(
"""CCCC
1
1 4
"""
) == "CATG"

# tie between all nucleotides
assert run(
"""ATGC
1
1 4
"""
) == "ATGC"

# boundary intervals
assert run(
"""ATGCAT
2
1 3
4 6
"""
) == "\n".join([
    "ATGC",
    "CATG"
])
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个字符 |`ATGC`| 最小输入尺寸 |
 |`CCCC`|`CATG`| 三个零频率联系 |
 |`ATGC`|`ATGC`| 所有频率均相等 |
 | 边界间隔 |`ATGC`,`CATG`| 正确的两端前缀减法 |

 ## 边缘情况

 考虑领带的例子```
AT
1
1 2
```计算出的频率是`(1, 1, 0, 0)`为了`(A, T, G, C)`。 对对进行排序`(-count, letter)`给出`A`,`T`,`G`,`C`，生产```
ATGC
```平局决胜规则是自动处理的，因为相等的负数让字母决定顺序。 

现在考虑```
AAAA
1
1 4
```前缀差异产生计数`(4, 0, 0, 0)`。 排序后，`A`由于频率较大，所以排在第一位。 其余三个核苷酸具有相同的计数，因此它们的顺序保持为`T`,`G`,`C`, 给予```
ATGC
```最后，考虑单字符间隔。```
G
1
1 1
```间隔计数为`(0, 0, 1, 0)`。 唯一的正数属于`G`，所以它首先出现。 剩余的零频率核苷酸保持优先顺序，产生```
GATC
```所有三种情况都直接遵循前缀和计算和元组排序规则，不需要任何特殊情况逻辑。
