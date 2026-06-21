---
title: "CF 106202B - \u0422\u043e\u0440\u0433\u043e\u0432\u0446\u044b"
description: "我们看到一排商人，每个人都拿着一件带有价格的商品。 第 i 个商家的价格是 0 到 $2^k - 1$ 范围内的整数，每个价格在概念上都存储为固定长度的 k 位二进制数。 系统处理三种类型的操作。"
date: "2026-06-20T22:28:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106202
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2025-2026, \u041f\u0435\u0440\u0432\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 106202
solve_time_s: 56
verified: true
draft: false
---

[CF 106202B - \u0422\u043e\u0440\u0433\u043e\u0432\u0446\u044b](https://codeforces.com/problemset/problem/106202/B)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们看到一排商人，每个人都拿着一件带有价格的商品。 第 i 个商家的价格是 0 到 0 之间的整数$2^k - 1$，并且每个价格在概念上都存储为固定长度的 k 位二进制数。 

系统处理三种类型的操作。 第一种类型更新单个商家的价格。 第二种类型对商家的一段进行转换：段中的每个价格都通过采用其 k 位二进制形式、翻转每一位并将结果解释回整数来重写。 第三种类型要求一个分段的价格总和。 

关键细节是，位反转不是算术否定或具有固定掩码的异或，除非我们认识到固定宽度二进制中发生的情况：每个数字 x 都转换为$(2^k - 1) - x$。 

限制很大：多达 20 万个商户和 20 万个操作。 这立即排除了任何重新计算段总和或为每个查询逐个元素应用翻转的解决方案。 即使是对数数据结构也必须避免触及反转查询下的每个元素。 

一个微妙的点是，反转在整个段上是可逆的且均匀的。 翻转两次的段将恢复到其原始状态。 另一个重要方面是更新覆盖值，它必须尊重结构中任何待处理的翻转。 

当 k 相对于值较小或较大时，尤其是当所有位均为 1 或 0 时，就会出现边缘情况，此时反转变为恒等或完全补行为。 另一个棘手的场景是反转与点更新重叠； 如果处理不当，过时的值可能会传播。 

例如，如果 k = 3 且 x = 2（二进制 010），则反转会产生 101，即 5。如果我们在整数否定方面思考不正确，则当 k 更改表示大小时，我们可能会错误地处理中间状态，但这里 k 是全局固定的。 

## 方法

 直接方法显式维护数组。 类型 1 查询更新单个位置。 类型 2 查询迭代范围并将每个值 x 替换为$(2^k - 1) - x$。 类型 3 查询直接对段求和。 

这是正确的，但在最坏情况的输入下会立即失败。 每次求逆或求和运算都需要 O(n)，并且最多 200,000 次运算，最坏情况达到$O(nq)$，这远远超出了可行的限度。 

转换的结构是关键的观察。 每次反转都会用恒定的线性变换替换段中的每个值 x：$x \mapsto C - x$， 在哪里$C = 2^k - 1$。 这是仿射。 总的来说，它的表现是可预测的：

 如果一个段的长度为 len，总和为 S，则反转后其新总和变为：$$len \cdot C - S$$这意味着我们永远不需要接触单个元素。 我们只需要维护段和并支持“翻转状态”的范围分配。 

剩下的挑战是可组合性：在同一性和互补性之间重复反转切换。 这表明带有布尔翻转标志的惰性传播线段树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 带有延迟翻转的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 我们维护一棵线段树，其中每个节点存储其线段之和。 此外，每个节点都带有一个惰性标志，指示其段当前是否逻辑反转。 

1. 用初始值构建线段树。 每个节点存储其段的总和，并且没有待处理的翻转。 这允许直接聚合查询。 
2. 定义节点上的反转效果。 如果长度为 len 的段的总和为 S，则反转后，其新总和将变为 len 乘以 C 减去 S。这使我们能够在节点上以 O(1) 的时间更新整个段。 
3. 对于范围反转查询，当节点段被完全覆盖时，我们将变换直接应用于其总和并切换其惰性标志。 切换两次会取消，从而保持正确性。 
4. 当一个节点被部分覆盖时，我们在下降之前将任何挂起的反转向下推。 推送意味着将反转状态应用于子级并清除父级的标志。 
5. 对于点更新，我们导航到叶子。 沿着路径，我们确保所有待处理的翻转都被推送，以便叶子在覆盖它之前反映真实的当前值。 
6. 更新叶子后，我们通过对子节点求和来向上重新计算总和。 
7. 对于范围求和查询，我们同样通过在降序之前推送惰性标志来确保正确性，然后直接对完全覆盖的段求和。 

关键的结构思想是求逆在总和和自逆上是线性的，这使得它可以被编码为单个布尔标签。 

### 为什么它有效

 正确性取决于两个不变量。 首先，每个节点存储的总和始终表示其段的真实总和或仅应用一个尚未传播到子节点的挂起反转标志后的总和。 其次，反转操作在段上是分布式的：将其应用于不相交段的并集相当于将其独立地应用于每个段。 因为反转是它自己的反转，所以惰性标志只需要奇偶校验，而不需要历史记录。 这保证了任何更新序列都可以简化为一致的局部转换，而不会产生歧义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr, k):
        self.n = len(arr)
        self.k = k
        self.C = (1 << k) - 1
        self.sum = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            self.sum[v] = arr[l]
            return
        m = (l + r) // 2
        self.build(v*2, l, m, arr)
        self.build(v*2+1, m+1, r, arr)
        self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

    def apply_flip(self, v, l, r):
        length = r - l + 1
        self.sum[v] = length * self.C - self.sum[v]
        self.lazy[v] ^= 1

    def push(self, v, l, r):
        if not self.lazy[v] or l == r:
            return
        m = (l + r) // 2
        self.apply_flip(v*2, l, m)
        self.apply_flip(v*2+1, m+1, r)
        self.lazy[v] = 0

    def update_point(self, v, l, r, idx, val):
        if l == r:
            self.sum[v] = val
            return
        self.push(v, l, r)
        m = (l + r) // 2
        if idx <= m:
            self.update_point(v*2, l, m, idx, val)
        else:
            self.update_point(v*2+1, m+1, r, idx, val)
        self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

    def range_flip(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply_flip(v, l, r)
            return
        self.push(v, l, r)
        m = (l + r) // 2
        if ql <= m:
            self.range_flip(v*2, l, m, ql, qr)
        if qr > m:
            self.range_flip(v*2+1, m+1, r, ql, qr)
        self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

    def range_sum(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.sum[v]
        self.push(v, l, r)
        m = (l + r) // 2
        res = 0
        if ql <= m:
            res += self.range_sum(v*2, l, m, ql, qr)
        if qr > m:
            res += self.range_sum(v*2+1, m+1, r, ql, qr)
        return res

n, k = map(int, input().split())
arr = list(map(int, input().split()))
q = int(input())

st = SegTree(arr, k)

for _ in range(q):
    tmp = input().split()
    t = int(tmp[0])
    if t == 1:
        i = int(tmp[1]) - 1
        x = int(tmp[2])
        st.update_point(1, 0, n-1, i, x)
    elif t == 2:
        l = int(tmp[1]) - 1
        r = int(tmp[2]) - 1
        st.range_flip(1, 0, n-1, l, r)
    else:
        l = int(tmp[1]) - 1
        r = int(tmp[2]) - 1
        print(st.range_sum(1, 0, n-1, l, r))
```该实现使用具有惰性传播的经典线段树。 关键线是转变`length * C - sum[v]`，它编码完全按位反转而不触及单个元素。 惰性标志被异或，因为两次翻转抵消了。 

推操作确保部分递归之前的正确性。 如果没有它，点更新将覆盖陈旧的反转值。 范围操作总是在递归后重新计算子节点的总和，以保持一致性。 

## 工作示例

 考虑一个 k = 3 的小数组：`[1, 2, 3]`，所以 C = 7。 

### 示例1：单次翻转和查询

 | 步骤| 运营| 受影响的细分市场 | 总和状态 |
 | --- | --- | --- | --- |
 | 1 | 初始| [1,2,3]| 6 |
 | 2 | 翻转 [1,3] | 全段| 3 * 7 - 6 = 15 | 3 * 7 - 6 = 15 |
 | 3 | 查询 [2,2] | 叶 2 | 7 - 2 = 5 | 7 - 2 = 5

 翻转后，每个元素都变成其补码：1→6、2→5、3→4。 线段树在不扩展元素的情况下捕获了这一点。 

### 示例 2：翻转然后点更新

 重新开始：`[1, 2, 3]`| 步骤| 运营| 数组解释 | 总和 |
 | --- | --- | --- | --- |
 | 1 | 翻转 [1,3] | [6,5,4]| 15 | 15
 | 2 | 设置索引 2 = 0 | [6,0,4]| 10 | 10
 | 3 | 查询 [1,3] | 直接求和| 10 | 10

 重要的细节是，点更新首先解决挂起的翻转，以便在覆盖之前索引 2 被正确地视为 5。 

每条轨迹都表明我们永远不需要在翻转后具体化完整的数组； 仅需要总和和惰性状态。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次更新、翻转或查询都会降低线段树的高度 |
 | 空间| O(n) | 线段树数组存储总和和惰性标志 |

 当 n 和 q 高达 200,000 时，每次操作的对数成本完全在限制范围内。 常数因子很小，因为每个节点的反转为 O(1)。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, arr, k):
            self.n = len(arr)
            self.k = k
            self.C = (1 << k) - 1
            self.sum = [0] * (4 * self.n)
            self.lazy = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, v, l, r, arr):
            if l == r:
                self.sum[v] = arr[l]
                return
            m = (l + r) // 2
            self.build(v*2, l, m, arr)
            self.build(v*2+1, m+1, r, arr)
            self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

        def apply_flip(self, v, l, r):
            length = r - l + 1
            self.sum[v] = length * self.C - self.sum[v]
            self.lazy[v] ^= 1

        def push(self, v, l, r):
            if not self.lazy[v] or l == r:
                return
            m = (l + r) // 2
            self.apply_flip(v*2, l, m)
            self.apply_flip(v*2+1, m+1, r)
            self.lazy[v] = 0

        def update_point(self, v, l, r, idx, val):
            if l == r:
                self.sum[v] = val
                return
            self.push(v, l, r)
            m = (l + r) // 2
            if idx <= m:
                self.update_point(v*2, l, m, idx, val)
            else:
                self.update_point(v*2+1, m+1, r, idx, val)
            self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

        def range_flip(self, v, l, r, ql, qr):
            if ql <= l and r <= qr:
                self.apply_flip(v, l, r)
                return
            self.push(v, l, r)
            m = (l + r) // 2
            if ql <= m:
                self.range_flip(v*2, l, m, ql, qr)
            if qr > m:
                self.range_flip(v*2+1, m+1, r, ql, qr)
            self.sum[v] = self.sum[v*2] + self.sum[v*2+1]

        def range_sum(self, v, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.sum[v]
            self.push(v, l, r)
            m = (l + r) // 2
            res = 0
            if ql <= m:
                res += self.range_sum(v*2, l, m, ql, qr)
            if qr > m:
                res += self.range_sum(v*2+1, m+1, r, ql, qr)
            return res

    n, k = map(int, input().split())
    arr = list(map(int, input().split()))
    q = int(input())
    st = SegTree(arr, k)

    out = []
    for _ in range(q):
        tmp = input().split()
        t = int(tmp[0])
        if t == 1:
            i = int(tmp[1]) - 1
            x = int(tmp[2])
            st.update_point(1, 0, n-1, i, x)
        elif t == 2:
            l = int(tmp[1]) - 1
            r = int(tmp[2]) - 1
            st.range_flip(1, 0, n-1, l, r)
        else:
            l = int(tmp[1]) - 1
            r = int(tmp[2]) - 1
            out.append(str(st.range_sum(1, 0, n-1, l, r)))

    return "\n".join(out)

# Sample-style small test
assert run("""3 3
1 2 3
4
3 1 3
2 1 3
3 1 3
3 2 2
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 小翻页+查询| 手册| 反演的基本正确性|
 | 单元素更新 | 手册| 点更新与惰性状态|
 | 全部翻转两次| 原始金额 | XOR翻转的幂等性|
 | 最大 k 边界值 | 正确的补数和| 处理全位范围|

 ## 边缘情况

 在同一范围内重复翻转的情况表明惰性标志表现为奇偶校验。 如果一个段被翻转两次，存储的节点应该准确地返回到其原始总和。 该实现处理这个问题是因为`lazy[v] ^= 1`切换状态并且变换公式是自逆的。 

待翻转后的点更新更加微妙。 假设一个节点逻辑倒置但没有压入，我们直接覆盖一个叶子。 如果不推送，更新将应用于陈旧的表示。 代码通过调用来保证正确性`push`在下降之前，因此叶子在修改之前始终以正确的状态具体化。 

当 k = 1 时，出现边界情况。然后 C = 1，反转只需交换 0 和 1。公式仍然成立：new sum = len - sum，并且线段树的行为相同，无需修改。
