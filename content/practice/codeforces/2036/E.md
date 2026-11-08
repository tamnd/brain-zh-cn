---
title: "CF 2036E - 逆转河流"
description: "给定一个有 n 个国家的世界，每个国家分为 k 个区域，每个区域都有一个初始水值 a[i][j]。 圣人建造了渠道，使一个地区的水流经同一地区的国家指数下游。"
date: "2026-06-08T10:21:14+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "constructive-algorithms", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2036
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 984 (Div. 3)"
rating: 1600
weight: 2036
solve_time_s: 124
verified: true
draft: false
---

[CF 2036E - 逆转河流](https://codeforces.com/problemset/problem/2036/E)

 **评分：** 1600
 **标签：** 二分查找、构造算法、数据结构、贪心
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个世界`n`国家，每个国家分为`k`区域，每个区域都有一个初始水值`a[i][j]`。 圣人建造了渠道，使一个地区的水流经同一地区的国家指数下游。 重新分配后，该区域的水值`j`在国内`i`成为该地区从国家 1 到国家 1 的所有值的累积按位或`i`。 正式地，`b[i][j] = a[1][j] | a[2][j] | ... | a[i][j]`。 

查询是区域要求的集合。 每个要求指定一个区域、一个比较运算符 (`<`或者`>`）和阈值。 我们被要求找到满足查询中所有要求的最早的国家（最小的索引），或者`-1`如果没有国家适合。 

约束条件告诉我们`n*k <= 10^5`并且所有查询的查询需求总数也最多为`10^5`。 这意味着我们不能采用一种幼稚的方法来检查每个国家/地区的每个查询的每个要求，因为最坏的情况是`O(n*q*k)`操作可以达到`10^10`。 我们需要预处理累积的 OR 值并利用每个查询的快速查找。 

当同一区域的多个要求相互矛盾时，就会出现微妙的边缘情况，例如，`r > 5`和`r < 3`在同一个查询中。 粗心的代码可能会选择一个满足一项要求但不能同时满足两项要求的国家/地区。 另一个边缘情况是累积 OR 过早达到最大值，使得以后的比较变得微不足道。 

## 方法

 暴力解决方案将计算每个国家和地区的累积 OR。 对于每个查询，我们将迭代所有国家/地区，检查每个要求，并在第一个满足所有要求的国家/地区停止。 这是有效的，因为它正确地模拟了问题规则，但它在规模上失败了。 和`n = 10^5`,`k = 10^5`，并查询至`10^5`，总操作量很容易超过`10^10`。 

关键的见解是累积 OR 数组`b`每比特是单调非递减的：一旦某比特变为 1，则对于所有后续国家，它都保持为 1。 这使我们能够预先计算每个地区最早出现的国家`b[i][j]`跨过门槛。 为了`<`要求，我们可以跟踪最后一个值严格小于阈值的国家。 为了`>`要求，我们跟踪第一个超过阈值的国家。 通过存储这些索引，每个查询减少为计算“第一个超出”索引的最大值`>`约束和“最后以下”指数的最小值`<`限制。 如果最大索引小于或等于最小索引，则答案存在； 否则，它不会。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n_k + q_n*k) | O(n_k + q_n*k) | O(n*k) | 太慢了|
 | 最佳 | O(n*k + 总要求) | O(n*k) | 已接受 |

 ## 算法演练

 1.初始化一个数组`b`尺寸的`n x k`存储累积或值。 对于每个地区`j`， 放`b[0][j] = a[0][j]`。 
2. 对于每个国家`i`从 1 到`n-1`以及各个地区`j`, 计算`b[i][j] = b[i-1][j] | a[i][j]`。 这会预先计算水的分布。 
3.对于每个查询，初始化两个指针`l = 1`和`r = n`代表可行的国家范围。 
4. 迭代查询的要求。 对于一个需求`(region, operator, value)`：

 - 如果操作员是`>`，执行二分查找`b[:,region]`找到第一个国家索引`idx`在哪里`b[idx][region] > value`。 更新`l = max(l, idx+1)`。 
- 如果操作员是`<`，执行二分查找找到第一个国家索引`idx`在哪里`b[idx][region] >= value`。 更新`r = min(r, idx)`。 
5. 处理完所有需求后，如果`l <= r`， 输出`l`作为最小的合适国家指数。 否则，输出`-1`。 

工作原理：预先计算的累积 OR 数组在每个区域都是非递减的，因此二分搜索可以正确识别阈值交叉点。 通过交叉所有要求的可行区间，我们确保所选国家满足每个约束。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

n, k, q = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]

# compute cumulative OR for each region
b = [a[0][:]]
for i in range(1, n):
    b.append([b[i-1][j] | a[i][j] for j in range(k)])

# transpose for easier access per region
b_cols = list(zip(*b))

for _ in range(q):
    m = int(input())
    l, r = 0, n-1  # 0-based indexing
    requirements = []
    for _ in range(m):
        r_idx, op, c = input().split()
        r_idx = int(r_idx)-1
        c = int(c)
        requirements.append((r_idx, op, c))
    
    for r_idx, op, c in requirements:
        col = b_cols[r_idx]
        if op == '>':
            idx = bisect.bisect_right(col, c)
            l = max(l, idx)
        else:  # '<'
            idx = bisect.bisect_left(col, c)
            r = min(r, idx-1)
    if l <= r:
        print(l+1)
    else:
        print(-1)
```该代码首先计算累积 OR`b`然后将其转置为`b_cols`用于按列访问。 我们使用Python的`bisect`有效地找到阈值交叉点。`l`和`r`代表国家的可行范围； 处理完所有要求后，我们检查是否存在有效的国家/地区。 

## 工作示例

 **示例输入 1**```
3 4 4
1 3 5 9
4 6 5 3
2 1 2 7
3
1 > 4
2 < 8
1 < 6
2
1 < 8
2 > 8
1
3 > 5
2
4 > 8
1 < 8
```| 国家 | 区域 1 | 区域 2 | 区域 3 | 区域 4 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 3 | 5 | 9 |
 | 2 | 5 | 7 | 5 | 11 | 11
 | 3 | 7 | 7 | 7 | 15 | 15

 查询1要求：`(1 > 4)`,`(2 < 8)`,`(1 < 6)`二分搜索产生可行的国家索引 1（从 0 开始）→ 输出`2`。 

查询2：`(1 < 8)`,`(2 > 8)`没有一个国家同时满足→产出`-1`。 

查询3：`(3 > 5)`第一个满足的国家 → 国家 3 → 产出`3`。 

查询4：`(4 > 8)`,`(1 < 8)`第一个满足的国家 → 国家 1 → 产出`1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*k + 总需求 * log n) | 预先计算累积 OR 所需时间`n*k`。 每个要求的二分查找都是 O(log n)。 总要求 <= 1e5。 |
 | 空间| O(n*k) | 存储累积 OR 数组。 |

 考虑到约束条件，这符合 2 秒的时间限制，如下所示`n*k <= 1e5`和总需求`<= 1e5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution
    exec(open("solution.py").read(), globals())
    return output.getvalue().strip()

# Provided sample
assert run("""3 4 4
1 3 5 9
4 6 5 3
2 1 2 7
3
1 > 4
2 < 8
1 < 6
2
1 < 8
2 > 8
1
3 > 5
2
4 > 8
1 < 8""") == "2\n-1\n3\n1"

# Custom case: all equal values
assert run("""2 2 1
5 5
5 5
2
1 > 4
2 < 6""") == "1"

# Custom case: no suitable country
assert run("""2 2 1
1 2
3 4
2
1 > 10
2 < 1""") == "-1"

# Custom case: minimum input
assert run("""1 1 1
1
1
1 > 0""") == "1"

# Custom case: multiple options, pick smallest
```
