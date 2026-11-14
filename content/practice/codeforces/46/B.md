---
title: "CF 46B - 赞助商提供的 T 恤"
description: "我们的 T 恤库存有限，有 5 种尺码：S、M、L、XL 和 XXL。 比赛的每位参赛者都有自己喜欢的尺寸。 参与者按照固定顺序到达，并尝试挑选最接近他们喜欢的尺寸的 T 恤。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 46
codeforces_index: "B"
codeforces_contest_name: "School Personal Contest #2 (Winter Computer School 2010/11) - Codeforces Beta Round 43 (ACM-ICPC Rules)"
rating: 1100
weight: 46
solve_time_s: 73
verified: true
draft: false
---

[CF 46B - 赞助商提供的 T 恤](https://codeforces.com/problemset/problem/46/B)

 **评分：** 1100
 **标签：** 实施
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的 T 恤库存有限，有 5 种尺码：S、M、L、XL 和 XXL。 比赛的每位参赛者都有自己喜欢的尺寸。 参与者按照固定顺序到达，并尝试挑选最接近他们喜欢的尺寸的 T 恤。 如果有他们喜欢的尺寸，他们就会接受。 如果没有，他们会选择最接近的可用尺寸。 如果两个尺寸同样接近，他们会选择较大的一个。 目标是准确确定每个参与者收到的尺寸。 

输入由五个整数组成，代表每种尺寸的 T 恤数量，后跟参与者数量，然后是按参与者到达顺序排列的首选尺寸列表。 输出是每个参与者收到的实际 T 恤尺寸的序列。 

限制很严格但可以管理。 由于最多有 1000 名参与者和每种尺寸的最多 1000 件 T 恤，我们可以对每个参与者执行大约 5000 次检查，而不会超过典型的 2 秒时间限制。 这意味着算法大致为$O(K \cdot 5)$，其中 5 是尺寸数量，是可以接受的。 边缘情况包括某些尺寸的 T 恤为零、多个参与者更喜欢单一流行尺寸，或者仅保留更小或更大尺寸的情况。 例如，如果所有 S 和 M 衬衫都消失了，而某人更喜欢 M，则他们应该得到 L。天真的实现可能只是按照数组顺序选择下一件，这可能违反“如果平局则最接近且更大”的规则。 

## 方法

 蛮力方法会迭代每个参与者的尺寸偏好，并按首选顺序依次检查可用的衬衫。 您可以为每个参与者动态构建偏好顺序。 例如，喜欢 L 的人会按 L、XL、M、XXL、S 的顺序检查。 此方法之所以有效，是因为可以保证每个参与者都有一件 T 恤，但它需要重复为每个参与者生成偏好序列并搜索库存数量，从而导致$O(K \cdot 5)$运营。 当 K ≤ 1000 时，这是可以接受的，但可以通过根据与每个尺寸的距离预定义优先顺序来使其稍微清晰一些。 

关键的见解是只有五种固定尺寸，因此对于每个参与者，我们可以预先计算他们尝试拿衬衫的顺序。 这减少了任何动态计算并避免了平局决胜中的错误。 一旦偏好顺序存储在字典中，满足参与者的请求就是通过该列表的简单循环来找到剩余库存的第一个尺寸。 问题的结构，即为每个参与者提供有保证的衬衫和固定尺寸的集合，使这种方法成为最佳方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(K * 5) | O(1) | O(1) | 已接受 |
 | 最佳| O(K * 5) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将每个尺寸映射到从 0 到 4 的索引：S=0、M=1、L=2、XL=3、XXL=4。 这使得距离比较变得更容易。 
2. 将库存计数存储在与索引映射对齐的列表中。 例如，`stock[2]`代表可用的 L 恤数量。 
3. 将每个尺寸的偏好顺序预先计算为索引列表。 例如，对于 L（索引 2），偏好是`[2, 3, 1, 4, 0]`。 这是通过增加与首选索引的距离得出的，并且在平局的情况下，首先选择较大的索引。 
4. 按顺序遍历参与者。 将每个首选尺寸转换为其索引。 使用预先计算的偏好顺序查找剩余库存的第一个尺寸。 
5. 选择尺寸后，减少其库存数量并记录结果。 
6. 将最终索引转换回大小字符串并将其输出给每个参与者。 

这是有效的，因为在每一步中，每个参与者总是根据规则选择最接近的可用 T 恤。 不变的是，库存计数始终反映每个参与者之后剩余的衬衫，确保不会为两个参与者分配相同的衬衫，并且所有偏好都遵循“如果领带则最接近且更大”的规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

size_to_index = {'S': 0, 'M': 1, 'L': 2, 'XL': 3, 'XXL': 4}
index_to_size = ['S', 'M', 'L', 'XL', 'XXL']

# Precompute preference orders
preference_order = []
for i in range(5):
    order = [i]
    for d in range(1, 5):
        if i + d <= 4:
            order.append(i + d)
        if i - d >= 0:
            order.append(i - d)
    preference_order.append(order)

# Read stock
stock = list(map(int, input().split()))
k = int(input())

# Process participants
result = []
for _ in range(k):
    pref = input().strip()
    idx = size_to_index[pref]
    for choice in preference_order[idx]:
        if stock[choice] > 0:
            stock[choice] -= 1
            result.append(index_to_size[choice])
            break

# Output
print('\n'.join(result))
```该解决方案定义了从大小到索引的映射，以便于计算。 这`preference_order`列表确保遵循“如果平局则最接近且更大”的规则。 遍历每个参与者非常简单，因为偏好顺序是预先计算的。 库存在分配后立即减少以保持正确性。 

## 工作示例

 输入示例 1：```
1 0 2 0 1
3
XL
XXL
M
```| 参与者| 首选 | 优先顺序 | 之前库存 | 已分配 | 库存后|
 | --- | --- | --- | --- | --- | --- |
 | 1 | XL | [3,4,2,1,0] | [1,0,2,0,1] | 特大号 | [1,0,2,0,0] |
 | 2 | 特大号 | [4,3,2,1,0] | [1,0,2,0,0] | 左 | [1,0,1,0,0] |
 | 3 | 中号 | [1,2,0,3,4] | [1,0,1,0,0] | 左 | [1,0,0,0,0] |

 这演示了决胜局：当 XL 不可用时，参与者会选择下一个最接近的尺寸，当距离相等时，会选择较大的尺寸而不是较小的尺寸。 

输入示例 2：```
0 1 0 1 1
4
S
M
XL
XXL
```| 参与者| 首选 | 已分配 |
 | --- | --- | --- |
 | 1 | S | 中号 |
 | 2 | 中号 | 中号 |
 | 3 | XL | XL |
 | 4 | 特大号 | 特大号 |

 这表明正确处理零库存尺寸。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(K * 5) | 对于每个参与者，我们按偏好顺序最多检查 5 个尺寸。 |
 | 空间| O(1) | O(1) | 仅包含库存和偏好的 5 元素列表，以及大小 K 的输出。 

当 K ≤ 1000 时，这非常适合 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    size_to_index = {'S': 0, 'M': 1, 'L': 2, 'XL': 3, 'XXL': 4}
    index_to_size = ['S', 'M', 'L', 'XL', 'XXL']

    preference_order = []
    for i in range(5):
        order = [i]
        for d in range(1, 5):
            if i + d <= 4:
                order.append(i + d)
            if i - d >= 0:
                order.append(i - d)
        preference_order.append(order)

    stock = list(map(int, input().split()))
    k = int(input())

    result = []
    for _ in range(k):
        pref = input().strip()
        idx = size_to_index[pref]
        for choice in preference_order[idx]:
            if stock[choice] > 0:
                stock[choice] -= 1
                result.append(index_to_size[choice])
                break

    return '\n'.join(result)

# Provided samples
assert run("1 0 2 0 1\n3\nXL\nXXL\nM\n") == "XXL\nL\nL", "sample 1"

# Custom cases
assert run("0 0 1 0 1\n2\nL\nXXL\n") == "L\nXXL", "custom 1: minimal stock"
assert run("5 5 5 5 5\n5\nS\nM\nL\nXL\nXXL\n") == "S\nM\nL\nXL\nXXL", "custom 2: exact stock match"
assert run("0 1 0 1 0\n2\nS\nXXL\n") == "M\nXL", "custom 3: must pick nearest available"
assert run("0 0
```
