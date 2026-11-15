---
title: "CF 62B - Tyndex.Brome"
description: "任务是根据特定的误差函数计算用户输入的地址和潜在地址列表之间的一种“距离”。 用户输入长度为k的字符串s。 然后有 n 个潜在地址，每个地址都是任意长度的字符串。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "implementation"]
categories: ["algorithms"]
codeforces_contest: 62
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 58"
rating: 1800
weight: 62
solve_time_s: 78
verified: true
draft: false
---

[CF 62B - Tyndex.Brome](https://codeforces.com/problemset/problem/62/B)

 **评分：** 1800
 **标签：** 二分查找，实现
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是根据特定的误差函数计算用户输入的地址和潜在地址列表之间的一种“距离”。 用户输入一个字符串`s`长度`k`。 然后还有`n`潜在地址，每个地址都是任意长度的字符串。 对于潜在地址中的每个字符，我们尝试将其与最接近的相同字符匹配`s`。 如果该字符存在于`s`，我们添加位置之间的最小距离。 如果不存在，我们添加潜在地址的长度。 每个潜在地址的输出是一个代表总误差的数字。 

输入范围很重要。 我们最多可以有 100,000 个潜在地址，每个地址的长度不同，但所有长度的总和上限为 200,000。 这立即排除了任何幼稚的方法来检查每个字符与每个字符`s`以简单的 O(n * k * len(address)) 方式，因为在最坏的情况下可能会达到 10^10 次操作。 我们需要一种在所有地址长度之和上更接近线性的算法。 

微妙的边缘情况包括包含完全不存在的字符的地址`s`，地址相同于`s`，与非常短的地址相比`s`。 例如，如果`s = "abc"`一个潜在的地址是`"d"`，函数`F`应该返回`1`因为`d`没有出现在`s`。 无法正确处理丢失字符的简单实现可能会返回零。 

## 方法

 暴力解决方案很简单。 对于每个潜在地址，我们迭代每个字符并扫描`s`找到最接近的匹配。 这保证了正确性，因为我们实际上是在计算每个字符的最小距离。 然而，如果`s`长度为 10^5 并且我们有 10^5 个潜在地址，每个地址的长度最多为 2，这种方法可能需要大约 10^10 次比较。 这超出了时间限制。 

优化的关键观察是我们不需要扫描`s`每次对于每个角色。 相反，我们可以预先计算每个字符的位置`s`。 一旦我们对每个字符的索引列表进行了排序，我们就可以使用二分搜索在 O(log k) 时间内找到与任何给定索引最接近的位置。 总成本与所有地址的长度总和乘以 log k 成正比，这对于问题约束是可行的。 

另一个微妙的改进是处理缺少的字符`s`。 If a character is not in`s`，最小的误差贡献是地址的长度。 这在二分搜索步骤中很容易检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * k * m) | O(1) | O(1) | 太慢了|
 | 每个字符的二分搜索 | O(sum(len(地址)) * log k) | O(k) | 已接受 |

 ## 算法演练

 1.读取输入：整数`n`和`k`, 用户输入的字符串`s`，以及潜在地址列表。 
2. 预处理`s`通过记录每个字符“a”到“z”，它出现在的索引的排序列表`s`。 这使我们能够快速找到最近出现的任何字符。 
3. 对于每个潜在地址，初始化误差函数`F`为零。 一一迭代其字符。 
4. 对于当前字符，检查它是否存在于`s`使用预先计算的位置。 如果不是，请将潜在地址的长度添加到`F`并继续下一个字符。 
5. 如果该字符存在于`s`，使用二分查找查找最近的索引`s`到潜在地址中的当前位置。 计算绝对距离并将其添加到`F`。 
6. 处理完潜在地址中的所有字符后，打印或存储`F`。 
7. 对所有潜在地址重复步骤 3-6。 

不变的是，在预处理之后，潜在地址中的每个字符要么贡献最小可能的距离`F`如果它存在于`s`，或者如果没有，则提供完整的地址长度。 二分搜索保证我们找到最接近的索引，因此算法可以准确地计算所定义的函数。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

n, k = map(int, input().split())
s = input().strip()

# Precompute positions of each character in s
pos = {chr(c): [] for c in range(ord('a'), ord('z')+1)}
for i, ch in enumerate(s):
    pos[ch].append(i)

addresses = [input().strip() for _ in range(n)]

for address in addresses:
    F = 0
    for i, ch in enumerate(address):
        if not pos[ch]:
            F += len(address)
            continue
        idx_list = pos[ch]
        insert_point = bisect.bisect_left(idx_list, i)
        min_dist = float('inf')
        if insert_point < len(idx_list):
            min_dist = abs(idx_list[insert_point] - i)
        if insert_point > 0:
            min_dist = min(min_dist, abs(idx_list[insert_point-1] - i))
        F += min_dist
    print(F)
```在代码中，`pos`保存每个字符的所有位置`s`。 对于潜在地址中的每个字符，我们使用以下方法找到最接近的匹配`bisect_left`，同时考虑找到的索引和先前的索引，这确保我们始终采用最小距离。 如果缺少字符，我们会立即添加完整长度。 通过仔细索引并考虑插入点的两侧，可以避免相差一的错误。 

## 工作示例

 ### 示例 1

 输入：```
2 10
codeforces
codeforces
codehorses
```处理第一个地址`codeforces`：

 | 人物 | 地址中的索引 | s | 中最接近的索引 距离 |
 | ---| ---| ---| ---|
 | c | 0 | 0 | 0 |
 | 哦| 1 | 1 | 0 |
 | d | 2 | 2 | 0 |
 | 电子| 3 | 3 | 0 |
 | f | 4 | 4 | 0 |
 | 哦| 5 | 5 | 0 |
 | r | 6 | 6 | 0 |
 | c | 7 | 7 | 0 |
 | 电子| 8 | 8 | 0 |
 | s | 9 | 9 | 0 |`F = 0`处理第二个地址`codehorses`：

 | 人物 | 索引 | s | 中最接近的索引 距离 |
 | ---| ---| ---| ---|
 | c | 0 | 0 | 0 |
 | 哦| 1 | 1 | 0 |
 | d | 2 | 2 | 0 |
 | 电子| 3 | 3 | 0 |
 | 小时 | 4 | 无 | 11 | 11
 | 哦| 5 | 5 | 0 |
 | r | 6 | 6 | 0 |
 | s | 7 | 9 | 2 |
 | 电子| 8 | 8 | 0 |
 | s | 9 | 9 | 0 |`F = 12`这证实了距离的正确计算和丢失字符的处理。 

### 示例 2（边缘情况）

 输入：```
1 3
abc
d
```输出：```
1
```在这里，角色`d`不存在于`s`， 所以`F = len("d") = 1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(sum(len(地址)) * log k) | 预处理`s`是 O(k)。 每个地址的每个字符都需要在位置列表中进行二分搜索。 所有地址长度之和≤2·10^5，log k≤17，可接受。 |
 | 空间| O(k + n) | 将每个字符的位置存储在`s`需要 O(k)。 地址输入需要 O(n)。 |

 该算法完全满足 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        n, k = map(int, input().split())
        s = input().strip()
        pos = {chr(c): [] for c in range(ord('a'), ord('z')+1)}
        for i, ch in enumerate(s):
            pos[ch].append(i)
        addresses = [input().strip() for _ in range(n)]
        for address in addresses:
            F = 0
            for i, ch in enumerate(address):
                if not pos[ch]:
                    F += len(address)
                    continue
                idx_list = pos[ch]
                insert_point = bisect.bisect_left(idx_list, i)
                min_dist = float('inf')
                if insert_point < len(idx_list):
                    min_dist = abs(idx_list[insert_point] - i)
                if insert_point > 0
```
