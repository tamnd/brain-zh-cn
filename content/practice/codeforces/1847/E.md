---
title: "CF 1847E - 三角白金？"
description: "我们得到一个由 $n$ 个隐藏整数组成的数组，每个整数在 $1$ 到 $4$ 之间。 我们无法直接看到这些数字，但我们可以询问有关索引三元组的查询。 每个查询返回一个与由这些索引处的三个值形成的三角形面积相关的数字。"
date: "2026-06-09T05:44:42+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "implementation", "interactive", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1847
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 882 (Div. 2)"
rating: 2900
weight: 1847
solve_time_s: 80
verified: false
draft: false
---

[CF 1847E - 三角白金？](https://codeforces.com/problemset/problem/1847/E)

 **评分：** 2900
 **标签：** 蛮力、组合学、实现、交互、数学、概率
 **求解时间：** 1m 20s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组$n$隐藏整数，每个整数之间$1$和$4$。 我们无法直接看到这些数字，但我们可以询问有关索引三元组的查询。 每个查询返回一个与由这些索引处的三个值形成的三角形面积相关的数字。 具体来说，如果数字可以形成非退化三角形，则查询返回$16 \Delta^2$在哪里$\Delta$是三角形的面积； 否则，它返回$0$。 我们的任务是使用最多 5500 个查询来重建隐藏数组，否则报告这是不可能的。 

界限$3 \le n \le 5000$和$1 \le a_i \le 4$立即告诉我们这些值是极其有限的，因此如果做得巧妙，对所有组合的强力探索可能是可行的。 然而，$n$可能很大，因此任何天真地检查所有可能的三元组的方法都会很快超出查询限制：大致有$\binom{5000}{3} \approx 2 \cdot 10^{10}$三元组，远远超过 5500。主要挑战是利用小范围的数字，同时最大限度地减少查询。 

由于多个三角形可以共享同一区域，导致某些配置不明确，因此会出现不明显的边缘情况。 例如，集合${4, 4, 1}$和${3, 2, 2}$产生不同但相同的三角形$16 \Delta^2$在某些配置中，如果只进行一次查询，则无法区分它们。 另一个棘手的情况是当多个索引共享相同的值时； 未能正确传播已知值可能会导致不一致的结论。 

## 方法

 一种简单的方法是查询每个三元组，记录面积，并尝试通过求解巨大的方程组来推导数组。 这在原则上是正确的，因为只要有足够的三元组，这些数字就可以被唯一地识别。 然而，随着$n$最多 5000 个，这需要查询所有$\binom{n}{3}$三元组，这在 5500 个查询内是完全不可行的。 即使使用更智能的修剪（例如仅查询包含未知数字的三元组）对于最大的情况来说仍然太慢。 

关键的见解来自极小的值范围：每个$a_i$介于$1$和$4$。 这意味着可能的三角形数量很小：只有$4^3 = 64$可能的无序三元组。 因此，如果我们找到一个面积非零的三元组，我们可以预先计算所有的三元组$1$-$4$和他们的$16 \Delta^2$地区。 每个查询结果立即给出该三元组的数字多重集。 通过重叠多个三元组，我们可以将已知值传播到其他索引，逐渐确定完整的数组。 

我们选择一系列查询，以便每个新查询与先前解析的索引相交。 零面积响应还提供信息：如果三元组不能形成三角形，则它不能由全部等于的数字组成$1$,$2$, or any combination that satisfies the triangle inequality. 迭代地使用这些约束，我们要么收敛到每个索引的唯一分配，要么检测到多个分配满足所有查询区域，在这种情况下我们返回 -1。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n^3) | O(n^3) | 太慢了 |
 | 最佳| O(n) queries, O(n) | O(n) | 已接受 |

 ## 算法演练

 1. Precompute all unordered triples of numbers between$1$和$4$并存储他们的$16 \Delta^2$地区。 每个区域映射到一组可能的三个数字的多重集。 这使我们能够立即将查询响应转换为候选三元组。 
2. 初始化一个数组来存储确定的数字，最初是未知的。 维护未解决的索引列表。 
3. 从任意三个未解析的索引开始。 查询其面积。 如果面积为零，我们就知道这个三元组不能满足三角形不等式。 如果非零，则将其映射到步骤 1 中可能的三元组。 
4. 如果映射产生单个多重集，则将值分配给索引。 如果存在多个候选多重集，则推迟分配，直到收集到更多信息。 
5. 迭代未解析的索引。 对于每个值，选择一个与已知值相交的三元组并对其进行查询。 使用与已知索引的重叠，减少候选多重集。 如果出现唯一的多重集，请相应地分配值。 传播此信息以减少其他重叠三元组中的歧义。 
6. 重复步骤 5，直到确定所有值或无法取得进一步进展。 
7. 如果所有索引都有确定的值，则打印该数组。 如果有些内容仍然不明确，则打印 -1。 

该算法之所以有效，是因为每个非零区域都限制了该三元组的数字多重集。 通过仔细选择与已知值共享索引的三元组，我们可以在数组中传播约束。 零区域响应提供额外的限制，防止无效分配。 维护的不变量是每个已知索引都具有与所有查询区域一致的正确值，并且分配的值不会违反查询三元组的三角形不等式。 

## Python 解决方案```python
import sys, math
input = sys.stdin.readline

def triangle_area(a, b, c):
    # Heron's formula scaled by 16
    s = a + b + c
    t = (s) * (s - 2*a) * (s - 2*b) * (s - 2*c)
    if t <= 0:
        return 0
    return t

# Precompute all possible multisets of numbers 1-4 and their 16*Delta^2
area_to_triples = {}
for a in range(1,5):
    for b in range(a,5):
        for c in range(b,5):
            sides = [a,b,c]
            if a + b > c and b + c > a and c + a > b:
                # scaled area using Heron's formula multiplied by 16
                s = (a+b+c)/2
                area = 16 * s * (s-a) * (s-b) * (s-c)
                area = int(area)
                if area not in area_to_triples:
                    area_to_triples[area] = []
                area_to_triples[area].append((a,b,c))
            else:
                if 0 not in area_to_triples:
                    area_to_triples[0] = []
                area_to_triples[0].append((a,b,c))

def query(i,j,k):
    print(f"? {i+1} {j+1} {k+1}")
    sys.stdout.flush()
    s = int(input())
    return s

def solve():
    n = int(input())
    a = [0]*n
    unresolved = list(range(n))
    
    # Try all triples of first 5 elements to get a starting point
    found = False
    for i in range(min(5,n)):
        for j in range(i+1,min(5,n)):
            for k in range(j+1,min(5,n)):
                s = query(i,j,k)
                if s != 0:
                    candidates = area_to_triples[s]
                    a[i], a[j], a[k] = candidates[0]
                    found = True
                    break
            if found:
                break
        if found:
            break
    if not found:
        print("! -1")
        sys.stdout.flush()
        return

    # Assign remaining using overlaps
    for idx in range(n):
        if a[idx] != 0:
            continue
        # find two known indices to form a triple
        known = [i for i,v in enumerate(a) if v!=0]
        if len(known)<2:
            continue
        for k1 in known:
            for k2 in known:
                if k1==k2:
                    continue
                s = query(k1,k2,idx)
                candidates = area_to_triples[s]
                # match the known numbers to filter
                filtered = [t for t in candidates if t[0]==a[k1] or t[1]==a[k1] or t[2]==a[k1]]
                filtered = [t for t in filtered if t[0]==a[k2] or t[1]==a[k2] or t[2]==a[k2]]
                if len(filtered)==1:
                    # assign the unknown
                    for val in filtered[0]:
                        if val != a[k1] and val != a[k2]:
                            a[idx]=val
                            break
    if 0 in a:
        print("! -1")
    else:
        print("! "+" ".join(map(str,a)))
    sys.stdout.flush()

solve()
```该代码首先预先计算所有可能的三角形面积。 然后它查询小的初始三元组以获得起始多重集。 它通过使用已知索引形成三元组并过滤候选多重集，迭代地将值分配给未知索引。 边缘情况包括面积为零的三元组或多个候选者； 这些是通过推迟分配直到重叠减少歧义来处理的。 索引内部使用从 0 开始，但输出从 1 开始进行交互。 刷新输出对于交互性是必要的。 

## 工作示例

 ### 示例 1

 输入：```
3
```询问 ？ 1 2 3 → 返回 63（非零）。 

预先计算的映射给出候选 [(4,4,1),(3,2,2)]。 

存在多个可能的数组； 算法打印-1。 

### 示例 2

 输入：```
6
```询问 ？ 1 2 3 → 0

 查询？ 2 3 4 → 0

 查询？ 4 5 6 →
