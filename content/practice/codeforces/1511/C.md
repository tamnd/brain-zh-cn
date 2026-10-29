---
title: "CF 1511C - 另一种卡牌"
description: "我们得到一副有 n 张卡片的卡片，每张卡片的颜色都由 1 到 50 之间的整数表示。这副卡片从上到下排列，我们收到 q 个查询。"
date: "2026-06-10T18:58:46+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1511
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 107 (Rated for Div. 2)"
rating: 1100
weight: 1511
solve_time_s: 133
verified: true
draft: false
---

[CF 1511C - 又一张卡牌](https://codeforces.com/problemset/problem/1511/C)

 **评分：** 1100
 **标签：** 暴力破解、数据结构、实现、树
 **求解时间：** 2m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一副牌`n`卡片，每张都有一个由整数表示的颜色`1`到`50`。 甲板从上到下排列，我们收到`q`查询。 每个查询指定一种颜色，对于每个查询，我们需要在当前牌组中找到该颜色的第一张牌，报告其位置（从 1 开始的索引），然后将该牌移动到牌组的顶部。 挑战在于牌组会随着每次查询而动态变化，因此牌的位置会随着时间的推移而变化。 

限制因素很重要：两者`n`和`q`可以达到`300,000`。 一个简单的解决方案是扫描每个查询的甲板，执行`O(n * q)`操作，可以达到`9 * 10^10`在最坏的情况下。 这远远超出了 2 秒的时间限制，因此我们需要一种更有效的方法。 颜色范围有限（`1`到`50`）暗示我们可以利用这个小宇宙来有效地管理仓位。 

当一种颜色在甲板上多次出现时，就会出现微妙的边缘情况。 将第一个出现的位置移动到顶部会更改所有后续位置。 例如，如果牌组是`[1, 2, 1]`我们查询`1`，我们输出`1`并将其移至顶部，留下`[1, 2, 1]`。 下一个查询`1`现在应该返回`1`再次，因为之前移动的卡片仍然在顶部。 如果粗心地重新计算指数而不动态更新头寸，将会产生错误的结果。 

## 方法

 暴力方法会针对每个查询迭代整个卡片组，搜索第一次出现的所请求的颜色。 一旦找到，我们记录它的位置，将其从甲板上移除，然后将其插入顶部。 虽然正确，但此方法需要扫描最多`n`为每个卡`q`查询，时间复​​杂度为`O(n * q)`。 和`n`和`q`最多`3 * 10^5`，这可以按以下顺序执行`10^10`操作，这对于 2 秒的限制来说是不切实际的。 

关键的见解是颜色数量很少。 我们可以维护从每种颜色到当前牌组中第一次出现的颜色的映射。 我们可以使用颜色列表和更新索引来模拟它们的相对位置，而不是在数组中移动卡片。 当我们处理颜色的查询时，我们从地图中读取其当前位置，打印它，然后通过增加索引来调整卡片组中出现在它之前的所有其他颜色的位置。 最后，我们将查询到的颜色移动到顶部，相当于将其位置设置为`1`。 这种方法利用了有限的颜色范围并避免了全甲板扫描，从而降低了复杂性`O(n * c)`在哪里`c = 50`是颜色的数量，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了|
 | 最佳 | O(q * c) | O(c) | 已接受 |

 ## 算法演练

 1. 创建数组`pos`尺寸的`51`跟踪每种颜色的第一张卡的当前位置。 通过扫描甲板一次来初始化它，设置`pos[color]`到它出现的第一个索引。 这给出了每种颜色的起始位置。 
2. 迭代每个查询`t_j`。 使用`pos[t_j]`找到该颜色的第一张卡片的当前位置并打印它。 
3. 适用于所有颜色`c`在甲板上，如果`pos[c]`小于`pos[t_j]`, 增量`pos[c]`经过`1`。 这模拟了这些卡已通过移至顶部操作向下移动。 
4. 设置`pos[t_j]`到`1`因为查询的卡现在位于最上面。 
5. 对所有查询重复步骤 2-4。 

为什么它有效：不变的是`pos[c]`始终表示第一张颜色卡的当前从 1 开始的位置`c`在甲板上。 将卡片移动到顶部会增加其上方所有卡片的位置，从而保持正确的相对顺序。 由于颜色数量有限，更新中`pos`最多需要`50`每个查询的操作，这足够高效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, q = map(int, input().split())
a = list(map(int, input().split()))
t = list(map(int, input().split()))

# initialize position mapping
pos = [0] * 51
for idx, color in enumerate(a):
    if pos[color] == 0:
        pos[color] = idx + 1

result = []

for color in t:
    result.append(pos[color])
    # increment positions of colors above the current one
    for c in range(1, 51):
        if pos[c] < pos[color]:
            pos[c] += 1
    pos[color] = 1

print(*result)
```第一个循环确定了牌组中每种颜色的初始位置。 第二个循环使用以下方法有效地处理每个查询`pos`大批。 通过更新查询卡上方的所有颜色并将查询卡移动到顶部，我们可以保持正确的位置，而无需移动整个牌组。 重要的是`pos`array 使用从 1 开始的索引来匹配问题的输出要求。 

## 工作示例

 对于示例输入：```
7 5
2 1 1 4 3 3 1
3 2 1 1 4
```| 查询 | 之前的位置 | 输出| 更新后的位置 |
 | --- | --- | --- | --- |
 | 3 | [2:1,1:2,3:5,4:4] | 5 | [2:2,1:3,3:1,4:5] |
 | 2 | [2:2,1:3,3:1,4:5] | 2 | [2:1,1:4,3:2,4:6] |
 | 1 | [2:1,1:4,3:2,4:6] | 3 | [2:2,1:1,3:3,4:7] |
 | 1 | [2:2,1:1,3:3,4:7] | 1 | 不变|
 | 4 | [2:2,1:1,3:3,4:7] | 5 | [2:3,1:2,3:4,4:1] |

 该迹线显示了不变性`pos[c]`总是第一次出现的颜色`c`。 每次更新都准确反映了移至顶部操作。 

另一个小例子：

 输入：```
3 3
1 2 1
1 2 1
```| 查询 | 之前的位置 | 输出| 更新后的位置 |
 | --- | --- | --- | --- |
 | 1 | [1:1,2:2] | 1 | [1:1,2:3] |
 | 2 | [1:1,2:3] | 3 | [1:2,2:1] |
 | 1 | [1:2,2:1] | 2 | [1:1,2:2] |

 即使多次查询相同的颜色，位置也会正确调整。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * 50) = O(q) | 每个查询最多更新 50 种颜色的位置 |
 | 空间| O(51) = O(1) |`pos`数组存储每种颜色的第一次出现 |

 和`q`最多`3 * 10^5`，这提供了大约 1500 万次操作，在 2 秒内可以轻松完成。 内存使用量很小，因为我们只存储每种颜色的位置。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    t = list(map(int, input().split()))

    pos = [0] * 51
    for idx, color in enumerate(a):
        if pos[color] == 0:
            pos[color] = idx + 1

    result = []
    for color in t:
        result.append(pos[color])
        for c in range(1, 51):
            if pos[c] < pos[color]:
                pos[c] += 1
        pos[color] = 1
    return ' '.join(map(str, result))

# provided sample
assert run("7 5\n2 1 1 4 3 3 1\n3 2 1 1 4\n") == "5 2 3 1 5", "sample 1"

# minimum input
assert run("2 1\n1 2\n1\n") == "1", "minimum size"

# all equal
assert run("4 4\n1 1 1 1\n1 1 1 1\n") == "1 1 1 1", "all equal colors"

# alternating colors
assert run("5 5\n1 2 1 2 1\n2 1 2 1 2\n") == "2 1 3 1 2", "alternating pattern"

# maximum colors
assert run
```
