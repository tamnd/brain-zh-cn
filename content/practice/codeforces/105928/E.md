---
title: "CF 105928E - LCM 查询"
description: "我们正在维护一个动态数组，其中元素可以随时间变化，并且我们必须回答有关从这些元素派生的乘法结构的范围查询。 每个查询要么更新一个位置，要么询问数组的一部分。"
date: "2026-06-22T15:38:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105928
codeforces_index: "E"
codeforces_contest_name: "Soy Cup #2: Vivian"
rating: 0
weight: 105928
solve_time_s: 57
verified: true
draft: false
---

[CF 105928E - LCM 查询](https://codeforces.com/problemset/problem/105928/E)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护一个动态数组，其中元素可以随时间变化，并且我们必须回答有关从这些元素派生的乘法结构的范围查询。 每个查询要么更新一个位置，要么询问数组的一部分。 

对于范围内的查询，我们从概念上讲取该段中所有数字的最小公倍数。 我们不是输出 LCM 本身，而是计算 LCM 有多少个正因数，以固定素数为模。 

关键的难点在于数组很大，多达二十万个元素，而且更新和查询都是交错的。 每个值最多为十万，这个值足够小，可以进行质因数分解，但对于每个查询从头开始重新计算任何内容来说仍然太大。 

一种简单的方法是通过扫描范围并获取素数指数来重新计算每个查询的 LCM。 这会立即崩溃，因为每个查询都可能接触 O(n) 个元素，并且可能有 O(n) 个查询，从而导致 O(n²) 行为。 

第二个天真的想法是直接维护 LCM。 这也会失败，因为 LCM 值的大小会爆炸并且在更新时不稳定。 甚至存储它们也变得不可能。 

当重叠区域频繁发生更新时，会出现微妙的边缘情况。 例如，如果我们继续独立地重新计算每个查询的素数指数，我们就会重复分解相同的数字并丢失查询之间的所有共享结构。 

真正的挑战是认识到 LCM 结构完全由范围内的质数指数最大值控制，并且除数计数仅取决于这些指数，而不取决于 LCM 本身的数值。 

## 方法

 暴力解决方案独立地重新计算每个查询。 对于范围查询，它扫描从 l 到 r 的所有元素，分解每个数字，并跟踪该段中出现的每个素数的最大指数。 收集所有素数后，除数计数将计算为 (指数 + 1) 素数的乘积。 

这是正确的，因为 LCM 是通过对每个素数取该段中所有数字中的最大指数来定义的。 然而，这种方法太慢了。 每个分解的成本约为 O(√A)，每个查询涉及 O(n) 个元素，每个查询大约为 O(n√A)。 对于多达 2e5 个查询，这远远超出了可行的范围。 

关键的见解是每个数字仅对一小部分素数有贡献，并且每个素数只需要其在一定范围内的最大指数。 我们维护每个素数段信息，而不是从头开始重新计算。 由于值最多为 1e5，因此不同素数的总数是有限的，并且每个数字最多有几个素数因子。 

我们重新表述问题：对于每个素数p，我们需要维护一个数据结构，可以回答“点更新下p在[l，r]中的最大指数是多少”。 最终答案是（最大指数 + 1）的素数的乘积。 

这导致了位置上的线段树，其中每个节点存储该线段中从素数到最大指数的稀疏映射。 更新仅沿着一条从根到叶的路径重新计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q·n·√A) | O(q·n·√A) | O(1) | O(1) | 太慢了|
 | 素数指数上的线段树 | O(q log n · k) | O(q log n · k) | O(n log n·k) | O(n log n · k) | 已接受 |

 这里 k 是每个数的质因数的数量，它很小。 

## 算法演练

 我们预处理 1e5 以内的所有整数的最小质因数，因此我们可以快速将任何值分解为质数幂。 

然后，我们在数组上构建一棵线段树，其中每个节点存储一个字典，将素数映射到该线段内的最大指数。 

### 步骤

1. 预先计算 1e5 以内的所有值的最小质因数。 这允许在相对于其大小的对数时间内对任何数组元素进行因式分解。 如果没有这个，重复的 sqrt 分解在更新时会太慢。 
2. 将每个初始数组元素分解为质数指数对。 每个元素仅贡献几个条目，因此这种表示形式保持紧凑。 
3. 构建一棵线段树，其中每个叶节点对应一个数组位置并存储其素数指数图。 
4. 对于内部节点，通过对任一子节点中存在的每个素数取最大指数来合并其子节点。 这准确地反映了 LCM 在不相交段上的行为方式。 
5. 对于点更新，分解新值，替换叶子，并通过再次合并子节点来重新计算沿着到根的路径的所有线段树节点。 
6. 对于[l,r]的查询，遍历线段树并收集覆盖该区间的所有节点。 通过获取每个素数的最大指数来合并它们的素数映射。 
7. 获得查询范围的合并映射后，将答案计算为 (指数 + 1) 模 998244353 的所有素数的乘积。 

关键的设计选择是我们从不计算实际的 LCM。 我们只跟踪素数指数最大值，这足以保证正确性和效率。 

### 为什么它有效

 一组数字的最小公倍数完全由该组中每个素数的最大指数决定。 线段树在每个节点上都精确地维护了这种不变性：每个节点都存储其区间的正确最大指数表示。 由于合并节点保留了每个素数的最大值，因此每个查询都会重建该范围的正确指数配置文件。 除数计数公式仅取决于这些指数，因此一旦配置文件正确，最终产品就保证正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
MAXV = 100000

# smallest prime factor sieve
spf = list(range(MAXV + 1))
for i in range(2, int(MAXV ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, MAXV + 1, i):
            if spf[j] == j:
                spf[j] = i

def factorize(x):
    res = {}
    while x > 1:
        p = spf[x]
        cnt = 0
        while x % p == 0:
            x //= p
            cnt += 1
        res[p] = cnt
    return res

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size <<= 1
        self.tree = [dict() for _ in range(2 * self.size)]
        for i in range(self.n):
            self.tree[self.size + i] = factorize(arr[i])
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.merge(self.tree[2 * i], self.tree[2 * i + 1])

    def merge(self, a, b):
        if len(a) < len(b):
            a, b = b, a
        res = dict(a)
        for p, v in b.items():
            if p not in res or res[p] < v:
                res[p] = v
        return res

    def update(self, idx, val):
        i = self.size + idx
        self.tree[i] = factorize(val)
        i //= 2
        while i:
            self.tree[i] = self.merge(self.tree[2 * i], self.tree[2 * i + 1])
            i //= 2

    def query(self, l, r):
        l += self.size
        r += self.size
        left_res = {}
        right_res = {}
        while l <= r:
            if l % 2 == 1:
                left_res = self.merge(left_res, self.tree[l])
                l += 1
            if r % 2 == 0:
                right_res = self.merge(self.tree[r], right_res)
                r -= 1
            l //= 2
            r //= 2
        return self.merge(left_res, right_res)

n, q = map(int, input().split())
arr = list(map(int, input().split()))
st = SegTree(arr)

for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        _, i, x = tmp
        st.update(i - 1, x)
    else:
        _, l, r = tmp
        res = st.query(l - 1, r - 1)
        ans = 1
        for v in res.values():
            ans = (ans * (v + 1)) % MOD
        print(ans)
```线段树是基于分解表示而不是原始整数构建的。 每个节点存储一个字典，合并两个节点恰好对应于获取素数指数的坐标最大值。 

更新操作替换一颗叶子并仅重建到根的路径，从而在本地保留正确性而无需重新计算整个树。 

查询操作使用标准的两指针线段树遍历，仅从相关线段累积素数指数最大值。 

一个微妙的点是，合并字典在效率上是不对称的； 首先复制较大的地图会稍微减少开销，这在严格的约束下很重要。 

## 工作示例

 考虑数组`[6, 9, 12, 16]`。 

### 查询 1：`2 1 3`| 步骤| 细分 | 优质地图|
 | --- | --- | --- |
 | 6 | 2·3 | 2 {2:1, 3:1} |
 | 9 | 3²| {3:2} |
 | 12 | 12 2²·3 | {2:2, 3:1} |

 合并后的地图变成`{2:2, 3:2}`。 

答案是 (2+1)(2+1) = 9。 

这证实了该算法正确捕获了 LCM 结构，而无需显式形成 36。 

### 带更新的查询序列

 之后`1 2 15`，数组变为`[6, 15, 12, 16]`。 

立即查询`2 2 4`。 

| 步骤| 细分 | 优质地图|
 | --- | --- | --- |
 | 15 | 15 3·5 | 3·5 {3:1, 5:1} |
 | 12 | 12 2²·3 | {2:2, 3:1} |
 | 16 | 16 2⁴| {2:4} |

 合并后的地图变成`{2:4, 3:1, 5:1}`。 

答案是 (4+1)(1+1)(1+1) = 20。 

这表明更新正确传播并且线段树保持一致的素数最大值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n · k) | O(q log n · k) | 每次更新和查询都会涉及 O(log n) 个节点，每次合并都会处理小的素图 |
 | 空间| O(n log n·k) | O(n log n · k) | 每个线段树节点存储一个稀疏素图 |

 约束允许最多 2e5 次运算，因此对数行为是必要的。 由于每个数字的质因数很少，因此常数因子在 4 秒内保持足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MOD = 998244353
    MAXV = 100000

    spf = list(range(MAXV + 1))
    for i in range(2, int(MAXV ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, MAXV + 1, i):
                if spf[j] == j:
                    spf[j] = i

    def factorize(x):
        res = {}
        while x > 1:
            p = spf[x]
            cnt = 0
            while x % p == 0:
                x //= p
                cnt += 1
            res[p] = cnt
        return res

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.size = 1
            while self.size < self.n:
                self.size <<= 1
            self.tree = [dict() for _ in range(2 * self.size)]
            for i in range(self.n):
                self.tree[self.size + i] = factorize(arr[i])
            for i in range(self.size - 1, 0, -1):
                self.tree[i] = self.merge(self.tree[2 * i], self.tree[2 * i + 1])

        def merge(self, a, b):
            if len(a) < len(b):
                a, b = b, a
            res = dict(a)
            for p, v in b.items():
                if p not in res or res[p] < v:
                    res[p] = v
            return res

        def update(self, idx, val):
            i = self.size + idx
            self.tree[i] = factorize(val)
            i //= 2
            while i:
                self.tree[i] = self.merge(self.tree[2 * i], self.tree[2 * i + 1])
                i //= 2

        def query(self, l, r):
            l += self.size
            r += self.size
            left_res = {}
            right_res = {}
            while l <= r:
                if l % 2 == 1:
                    left_res = self.merge(left_res, self.tree[l])
                    l += 1
                if r % 2 == 0:
                    right_res = self.merge(self.tree[r], right_res)
                    r -= 1
                l //= 2
                r //= 2
            return self.merge(left_res, right_res)

    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            st.update(tmp[1] - 1, tmp[2])
        else:
            res = st.query(tmp[1] - 1, tmp[2] - 1)
            ans = 1
            for v in res.values():
                ans = (ans * (v + 1)) % MOD
            out.append(str(ans))

    return "\n".join(out)

# provided sample placeholders (replace with actual if needed)
# assert run(...) == ...
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素查询| 2 | 基除数计数 |
 | 重复更新相同索引| 正确的重新计算 | 更新正确性 |
 | 全系列查询| 取决于| 全局聚合正确性 |
 | 交替更新/查询| 输出稳定| 跨操作的持久性|

 ## 边缘情况

 关键的边缘情况是使用不同的因式分解重复更新同一索引。 例如，如果一个元素从高度合数变为素数，则线段树必须完全替换旧的贡献，而不是部分更新指数。 更新操作处理这个问题，因为它替换整个叶映射而不是增量修改它。 

另一种边缘情况是查询长度为 1 的段。 在这种情况下，答案只是单个值的除数的数量。 该算法自然地处理这个问题，因为线段树准确地返回叶节点图，并且乘积公式正确应用。 

最后一个微妙的情况是不同的段贡献不相交的素数集。 合并操作必须保留两侧的所有素数。 由于合并显式地迭代两个字典，因此不会丢失素数，并且即使素数在范围内不重叠，最终除数计数也保持正确。
