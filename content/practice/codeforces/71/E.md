---
title: "CF 71E - 核聚变"
description: "我们得到一组具有已知原子序数的原子和一组我们想要通过聚变产生的目标原子。 每次聚变操作恰好将两个原子合二为一，所得原子的原子序数是两个原始原子序数之和。 我们无法分裂原子。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp"]
categories: ["algorithms"]
codeforces_contest: 71
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 65 (Div. 2)"
rating: 2200
weight: 71
solve_time_s: 110
verified: false
draft: false
---

[CF 71E - 核聚变](https://codeforces.com/problemset/problem/71/E)

 **评分：** 2200
 **标签：** 位掩码、dp
 **求解时间：** 1m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一组具有已知原子序数的原子和一组我们想要通过聚变产生的目标原子。 每次聚变操作恰好将两个原子合二为一，所得原子的原子序数是两个原始原子序数之和。 我们无法分裂原子。 每个初始原子必须仅使用一次来生成目标原子，因此我们本质上是将初始集合划分为总和为所需原子序数的子集。 

输入提供元素的符号，我们通过元素周期表的查找表将其转换为原子序数。 小限度，$n \le 17$，立即表明枚举子集的指数算法是可行的。 初始原子的原子序数之和等于目标原子的原子序数之和，这保证了如果存在解，则可以纯粹通过重新排列子集求和来表达它。 关键的困难是确保每个原子都只使用一次，并且每个子集的总和恰好等于目标原子。 

当多个目标原子具有相同值时，会出现微妙的边缘情况。 首先分配最大数字的天真贪婪方法可能会选择错误的元素，并使后面的子集无法求解。 例如，如果初始数字是`[1,2,3,4]`目标是`[5,5]`, 采摘`[4,1]`前 5 片叶子`[2,3]`对于第二个，这是有效的，但是错误的选择，例如`[3,2]`第一片叶子`[1,4]`对于第二个。 详尽的或基于 DP 的方法可以正确处理这个问题。 

## 方法

 暴力方法会将初始集合的所有分区枚举到$k$子集，检查每个子集之和是否达到目标，并输出相应的融合操作。 分区方式的数量$n$项目进入$k$非空集由第二类斯特林数给出，它增长得非常快，大致$k^n$。 和$n=17$，这的顺序是$17^{17} \approx 10^{20}$，远远超出了可行的计算。 甚至检查所有$2^n$如果天真地多次完成子集就已经很昂贵了。 

提供可行解决方案的洞察力是双重的。 第一的，$n$很小，所以我们可以将子集表示为位掩码。 其次，我们可以在位掩码上使用动态编程来跟踪哪些原子子集可以求和到每个目标原子序数。 这将问题简化为：对于每个目标原子，找到总和与其匹配的初始原子的非重叠子集。 由于有$2^n$可能的子集，迭代它们是可行的（$2^{17} = 131072$）。 我们可以预先计算每个子集的总和，然后尝试使用记忆化将这些子集分配给目标，以避免重新计算。 最后，可以通过始终融合两个最大的剩余原子直到剩下一个原子来贪婪地重建融合序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（所有分区）| O(k^n) | O(k^n) | O(k^n) | O(k^n) | 太慢了 |
 | 位掩码 DP + 子集和 | O(k * 2^n * n) | O(2^n * n) | O(2^n * n) | 已接受 |

 ## 算法演练

 1. 将元素符号转换为原子序数。 存储符号和数字以重建解决方案。 
2. 将初始集合的每个子集表示为位掩码。 预先计算每个子集中的数字之和。 这允许快速查找哪些子集可以产生每个目标原子。 
3. 使用递归DP 尝试将子集分配给目标原子。 在每一步中，选择一个目标原子并尝试其总和与其原子序数匹配且其位尚未使用的每个子集。 将子集标记为已使用，并对其余目标进行递归。 如果所有目标都匹配，我们就有一个有效的分配。 
4. 如果没有子集与目标匹配或剩余目标无法完成，则回溯。 记忆化可以应用于未使用原子的掩码和目标原子的索引，以防止重新计算相同的子问题。 
5. 一旦找到目标子集的有效分配，就重建融合序列。 对于每个子集，重复融合两个最大的数字，直到剩下一个原子。 跟踪原始原子符号以将序列打印为`A+B+...->Target`。 
6.输出“YES”和k个融合序列。 如果没有找到分配，则输出“NO”。 

工作原理：DP 确保每个目标都获得正确求和的不相交原子子集，并且融合重建始终使用合法的成对融合将每个子集减少为单个原子。 不变量是每个初始原子都使用一次并且总和与目标匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# map of element symbols to atomic numbers
periodic_table = {
    "H":1,"He":2,"Li":3,"Be":4,"B":5,"C":6,"N":7,"O":8,"F":9,"Ne":10,
    "Na":11,"Mg":12,"Al":13,"Si":14,"P":15,"S":16,"Cl":17,"Ar":18,"K":19,"Ca":20,
    "Sc":21,"Ti":22,"V":23,"Cr":24,"Mn":25,"Fe":26,"Co":27,"Ni":28,"Cu":29,"Zn":30,
    "Ga":31,"Ge":32,"As":33,"Se":34,"Br":35,"Kr":36,"Rb":37,"Sr":38,"Y":39,"Zr":40,
    "Nb":41,"Mo":42,"Tc":43,"Ru":44,"Rh":45,"Pd":46,"Ag":47,"Cd":48,"In":49,"Sn":50,
    "Sb":51,"Te":52,"I":53,"Xe":54,"Cs":55,"Ba":56,"La":57,"Ce":58,"Pr":59,"Nd":60,
    "Pm":61,"Sm":62,"Eu":63,"Gd":64,"Tb":65,"Dy":66,"Ho":67,"Er":68,"Tm":69,"Yb":70,
    "Lu":71,"Hf":72,"Ta":73,"W":74,"Re":75,"Os":76,"Ir":77,"Pt":78,"Au":79,"Hg":80,
    "Tl":81,"Pb":82,"Bi":83,"Po":84,"At":85,"Rn":86,"Fr":87,"Ra":88,"Ac":89,"Th":90,
    "Pa":91,"U":92,"Np":93,"Pu":94,"Am":95,"Cm":96,"Bk":97,"Cf":98,"Es":99,"Fm":100
}

n, k = map(int, input().split())
initial_symbols = input().split()
target_symbols = input().split()

initial_numbers = [periodic_table[s] for s in initial_symbols]
target_numbers = [periodic_table[s] for s in target_symbols]

from itertools import combinations

# precompute subset sums
subset_sum = {}
for mask in range(1, 1<<n):
    total = 0
    for i in range(n):
        if mask & (1<<i):
            total += initial_numbers[i]
    subset_sum[mask] = total

memo = {}
assignment = [0]*k

def solve(mask, idx):
    if idx == k:
        return mask == 0
    key = (mask, idx)
    if key in memo:
        return False
    t = target_numbers[idx]
    submask = mask
    while submask:
        if subset_sum[submask] == t:
            if solve(mask ^ submask, idx+1):
                assignment[idx] = submask
                return True
        submask = (submask - 1) & mask
    memo[key] = False
    return False

if not solve((1<<n)-1, 0):
    print("NO")
    sys.exit(0)

print("YES")

# reconstruct fusion sequence
for idx in range(k):
    mask = assignment[idx]
    elems = []
    for i in range(n):
        if mask & (1<<i):
            elems.append((initial_numbers[i], initial_symbols[i]))
    elems.sort(reverse=True)
    sequence = []
    while len(elems) > 1:
        a = elems.pop(0)
        b = elems.pop(0)
        elems.append((a[0]+b[0], f"{a[1]}+{b[1]}"))
        elems.sort(reverse=True)
    print(f"{elems[0][1]}->{target_symbols[idx]}")
```每个部分都直接对应于算法步骤：将符号映射到数字，预先计算子集和，使用DP分配子集，然后首先贪婪地融合最大的原子来重建目标。 仔细的位掩码操作可以防止重复计算原子，并且排序可以确保正确的配对。 

## 工作示例

 **样品1**

 | 步骤| 面膜| 目标 idx | 选择的子集 | 剩余面膜|
 | --- | --- | --- | --- | --- |
 | 1 | 1111111111 | 0 (锡) | 锰+碳+钾| 剩余位|
 | 2 | ... | 1（铂）| 钴+锌+钪| ... |
 | 3 | ... | 2（Y）| 锂+镁+P+F | 0 |
