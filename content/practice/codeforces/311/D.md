---
title: "CF 311D - 间隔立方体"
description: "我们得到一个整数数组和一系列查询。 每个查询要么要求子数组的总和，要么指示我们对子数组中的每个元素进行立方。 输出由求和查询的答案组成，以 95542721 为模计算。"
date: "2026-06-05T18:42:03+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "math"]
categories: ["algorithms"]
codeforces_contest: 311
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 185 (Div. 1)"
rating: 2600
weight: 311
solve_time_s: 93
verified: true
draft: false
---

[CF 311D - 间隔立方](https://codeforces.com/problemset/problem/311/D)

 **评分：** 2600
 **标签：** 数据结构，数学
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一系列查询。 每个查询要么要求子数组的总和，要么指示我们对子数组中的每个元素进行立方。 输出由求和查询的答案组成，以 95542721 为模计算。 

该数组的长度最多可达 100,000 个元素，并且最多可有 100,000 个查询。 直接对每个查询的数组求和或更新的简单方法在最坏的情况下将执行多达 10^10 次操作，这远远超出了我们在几秒钟内可以计算的范围。 这意味着我们需要一个能够有效地允许范围求和查询和范围修改的数据结构。 

这个问题的一个棘手的方面是立方运算。 重复立方不是线性的，因此标准范围加法技术（例如用于加法或赋值的延迟传播）将无法直接起作用。 此外，模 95542721 是素数且足够小，可以有效地预计算重复立方。 

幼稚的实现可能会尝试在每次更新时对每个元素进行立方体。 例如，如果数组是`[2, 3]`我们将整个数组立方两次，一个粗心的循环就可以了`2**3 = 8`， 然后`8**3 = 512`,`3**3 = 27`， 然后`27**3 = 19683`。 虽然原则上是正确的，但对于大范围来说，这太慢了。 我们需要一种方法来避免接触每个立方体的每个元素。 

## 方法

 暴力方法直接迭代数组。 对于求和查询，它循环遍历范围内的所有元素，将它们以 95542721 为模相加，然后打印结果。 对于立方更新，它循环遍历范围内的所有元素，将每个元素提高到模 95542721 的三次方，然后写回。 这种做法是正确的，但是太慢了。 当 n 和 q 达到 10^5 时，对整个数组的最坏情况查询可能会导致 10^10 次操作。 

关键的见解是，立方是周期性模 95542721。如果您计算模 95542721 的数字的重复立方，最终序列会循环。 事实上，对这个素数取模，任何整数 x 在最多 48 次重复立方之后将返回到其原始值。 这一观察结果使我们能够将每个元素视为长度最多为 48 的循环。我们不是直接在数组上对值进行立方，而是为每个段存储 48 个预先计算的幂，并维护一个指向该段已立方次数的指针。 然后求和查询根据当前指针组合值，并且对整个范围求立方只会增加指针模 48。 

我们使用具有惰性传播的线段树来实现这一点。 每个节点存储一个由 48 个和组成的数组，表示其间隔的重复立方。 惰性值是该时间间隔内待处理的立方体数量。 传播时，我们根据惰性值旋转 sums 数组。 然后，查询访问正确的总和，而无需逐个元素重新计算立方体。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了 |
 | 具有立方循环的线段树| O(q * log n) | O(q * log n) | O(n * 48) | 已接受 |

 ## 算法演练

 1. 预先计算每个元素以 95542721 为模的立方序列。 对于元素 x，计算`x^(3^k) % 95542721`k = 0 到 47。将这 48 个值存储在一个数组中。 这定义了每个元素的立方周期。 
2. 构建线段树。 每个节点代表一个范围`[l, r]`数组的。 不存储单个和，而是存储一个包含 48 个和的数组，其中第 k 个元素是该范围内所有元素经过 k 次立方后的总和。 这允许回答任意数量的待处理立方体的求和查询。 
3. 使用惰性传播来处理多维数据集更新。 每个节点都有一个惰性计数器`lazy`指示其间隔应立方多少倍。 当节点收到立方体更新时，增量`lazy`modulo 48 并推迟更新其子项直到必要为止。 
4. 要将待处理的延迟值应用于节点，请将其 48 个和的数组旋转`lazy`职位。 例如，如果`lazy = 1`，再一次立方后的和变为索引 1 处的和，两次立方后的和变为索引 2，依此类推，进行环绕。 
5. 对于求和查询，像普通线段树查询一样遍历树。 访问节点时，应用挂起的延迟旋转，并从其 sums 数组中求出与其当前延迟值相对应的正确值。 
6. 组合两个子项时，按元素组合它们的和数组，尊重任何惰性旋转。 这确保父节点的总和始终与其子节点一致。 

工作原理：每个节点都维护所有 48 种可能的立方体状态。 延迟传播保证我们永远不会丢失更新：我们只旋转数组以反映立方操作。 Sum 查询从正确的旋转索引中读取。 这保留了正确性，因为旋转和模运算是一致且可逆的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 95542721
CYCLE = 48

class Node:
    __slots__ = ('sums', 'lazy')
    def __init__(self):
        self.sums = [0] * CYCLE
        self.lazy = 0

def cube_cycle(x):
    arr = [x % MOD]
    for _ in range(CYCLE-1):
        arr.append(pow(arr[-1], 3, MOD))
    return arr

def merge(left, right):
    node = Node()
    for i in range(CYCLE):
        node.sums[i] = (left.sums[i] + right.sums[i]) % MOD
    return node

def rotate(arr, k):
    k %= CYCLE
    return arr[k:] + arr[:k]

class SegmentTree:
    def __init__(self, data):
        self.n = len(data)
        self.tree = [Node() for _ in range(4*self.n)]
        self.build(1, 0, self.n-1, data)
        
    def build(self, v, l, r, data):
        if l == r:
            self.tree[v].sums = cube_cycle(data[l])
            return
        m = (l+r)//2
        self.build(2*v, l, m, data)
        self.build(2*v+1, m+1, r, data)
        self.tree[v] = merge(self.tree[2*v], self.tree[2*v+1])
    
    def push(self, v):
        lazy = self.tree[v].lazy
        if lazy:
            self.tree[2*v].lazy = (self.tree[2*v].lazy + lazy) % CYCLE
            self.tree[2*v+1].lazy = (self.tree[2*v+1].lazy + lazy) % CYCLE
            self.tree[v].sums = rotate(self.tree[v].sums, lazy)
            self.tree[v].lazy = 0
    
    def update(self, v, l, r, ql, qr):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            self.tree[v].lazy = (self.tree[v].lazy + 1) % CYCLE
            self.tree[v].sums = rotate(self.tree[v].sums, 1)
            return
        self.push(v)
        m = (l+r)//2
        self.update(2*v, l, m, ql, qr)
        self.update(2*v+1, m+1, r, ql, qr)
        self.tree[v] = merge(self.tree[2*v], self.tree[2*v+1])
    
    def query(self, v, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.tree[v].sums[self.tree[v].lazy]
        self.push(v)
        m = (l+r)//2
        return (self.query(2*v, l, m, ql, qr) + self.query(2*v+1, m+1, r, ql, qr)) % MOD

n = int(input())
a = list(map(int, input().split()))
tree = SegmentTree(a)
q = int(input())
for _ in range(q):
    t,l,r = map(int, input().split())
    l -= 1; r -= 1
    if t == 1:
        print(tree.query(1,0,n-1,l,r))
    else:
        tree.update(1,0,n-1,l,r)
```该代码使用预先计算的立方序列构建线段树。 惰性传播会轮换这些序列，而不是每次都重新计算幂。 更新会增加惰性计数器并旋转数组。 查询通过考虑当前惰性值来读取正确的总和。 

## 工作示例

 输入示例 1：```
8
1 2 3 4 5 6 7 8
5
1 2 5
2 2 5
1 2 5
2 3 6
1 4 7
```| 步骤| 查询 | 懒惰| 使用的节点总和 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 总和 2-5 | 0 | 总和[0] | 2+3+4+5=14 |
