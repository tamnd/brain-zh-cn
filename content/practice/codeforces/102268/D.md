---
title: "CF 102268D - 日期"
description: "我们有 (t) 个日历日，第 (x) 天最多可以举办 (ax) 个日期。 每个女孩最多可以约会一次，女孩 (i) 接受从 (li) 到 (ri) 的任何一天。 与她约会可以为答案做出贡献（pi）。"
date: "2026-08-19T04:18:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102268
codeforces_index: "D"
codeforces_contest_name: "300iq Contest 1"
rating: 0
weight: 102268
solve_time_s: 1010
verified: false
draft: false
---

[CF 102268D - 日期](https://codeforces.com/problemset/problem/102268/D)

 **评级：** -
 **标签：** -
 **求解时间：** 16m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有 (t) 个日历日，第 (x) 天最多可以举办 (a_x) 个日期。 每个女孩最多可以约会一次，女孩 (i) 接受从 (l_i) 到 (r_i) 的任何一天。 与她约会有助于 (p_i) 找到答案。 任务是选择一部分女孩，并为每个选定的女孩分配一个有效的、尊重能力的日子，以便总体快乐最大化。 

不寻常的结构条件是两个端点都已排序：

 [
 l_1\le l_2\le\cdots\le l_n,\qquad
 r_1\le r_2\le\cdots\le r_n。 
]

 这个条件是使匹配约束可压缩的关键。 如果没有它，自然公式就是一个大的加权匹配问题，对于 (n,t\le 300000) 来说代价太高了。 

该边界为大约 (O((n+t)\log n)) 运算留下了空间，但不为二次工作留下了空间。 检查每对女孩是否已进行 (O(n^2)) 次操作的过程，最大尺寸约为 (9\cdot10^{10})。 枚举所有子集显然是不可能的，因为它们有 (2^n) 个。 最终的解决方案使用排序加上两个惰性线段树，给出 (O((n+t)+n\log n)) 时间。 

一些边缘情况很容易被错误处理。 

由于没有可用容量，答案必须为零：```
1 1
0
1 1 10
```答案是`0`。 如果粗心的解决方案只检查每个区间本身是否非空，就会错误地选择女孩。 

几个女孩可以有完全相同的间隔，但容量仍然是共享的。 例如：```
2 1
1
1 1 5
1 1 4
```答案是`5`， 不是`9`。 两个女孩只能使用一个可用的插槽。 

独立检查每个选定的间隔也是不够的。 考虑：```
2 2
1 0
1 1 100
1 2 99
```每个女孩单独有一个包含至少一个容量单位的间隔，但不能将它们一起安排。 第一个女孩在第 (1) 天消耗了唯一的空位，而第二个女孩只能使用第 (1) 天，因为第 (2) 天的容量为零。 答案是`100`。 这正是霍尔定理所描述的全局条件。 

最后，必须包容性地处理边界。 在```
2 2
0 1
1 2 5
2 2 4
```两个女孩都只能使用第（2）天，所以只能选择一个，答案是`5`。 意外地将间隔视为半开会改变匹配约束。 

官方声明确认了端点排序和驱动 (O(n\log n)) 要求的 (300000) 边界。 

## 方法

 蛮力方法是枚举女孩的子集，确定这些女孩是否可以分配到不同的可用约会时段，并在可行的子集中保持最大的快乐。 这是正确的，因为考虑了女孩的每一个可能的选择。 如果可行性检查本身贪婪地将选定的间隔分配给可用槽，则一个子集可能已经需要 (O(n+t)) 工作，在最坏的情况下给出 (O(2^n(n+t)))。 即使忽略可行性成本，也无法处理 (2^{300000}) 个子集。 

下一个自然的想法是最大成本流。 创建每天的容量副本，并将每个女孩与她间隔的每一天联系起来。 这可以正确地对问题进行建模，但是图可以包含 (\Theta(nt)) 边，并且一般的匹配或流算法太慢。 

有用的观察结果是，可行的女孩集合形成了拟阵。 将每个单位的每日容量视为一个单独的槽。 女孩可以被匹配到与她的间隔中的一天相对应的任何时段。 当一组女孩可以匹配到不同的位置时，这些女孩就是可行的。 这样的可匹配子集形成横向拟阵。 然后，拟阵的加权贪婪定理表明，我们可以按照快乐的降序处理女孩，并在添加女孩使所选集合可行时精确地接受女孩。 这是核心优化步骤。 

剩下的问题是快速测试可行性。 

霍尔定理表明，当每个女孩集合在其允许天数的联合中具有至少与所选女孩一样多的可用天数时，所选集合是可调度的。 因为所有允许的集合都是区间，并且两个端点序列都是非递减的，所以检查女孩索引的连续块就足够了。 这将匹配条件转变为前缀上的不等式。 

如果女孩 (i) 已被接受，则 (b_i) 为 (1)，否则为 (0)。 让

 [
 A_x=\sum_{j=1}^{x}a_j
 ]

 是前缀容量，令

 [
 B_x=\sum_{j=1}^{x}b_j
 ]

 是所选女孩的前缀号码。 

对于一群女孩 (L,\ldots,R)，她们所有可能的日子都在 ([l_L,r_R]) 内。 霍尔的条件变为

 [
 B_R-B_{L-1}\le A_{r_R}-A_{l_L-1}。 
]

 重新排列给出

 [
 B_R-A_{r_R}\le B_{L-1}-A_{l_L-1}。 
]

 定义

 [
 c_R=B_R-A_{r_R}
 ]

 和

 [
 d_L=B_{L-1}-A_{l_L-1}。 
]

 整个可行集的特征是

 [
 c_R\le d_L\qquad\text{对于每个}L\le R。 
]

 这正是该问题的已知解决方案中使用的归约。 

假设我们正在考虑女孩 (x)。 在接受她之前，(b_x=0)。 添加她会增加每个 (B_i) 和 (i\ge x)，因此每个 (c_i) 和 (i\ge x) 都会增加 (1)。 仅当 (i>x) 时，它才会增加 (d_i)，因为 (d_i) 包含 (B_{i-1})。 因此，唯一可能变得更加严重的新不平等是那些

 [
 L\le x\le R。 
]

 对于这些不等式，(c_R) 增加 (1)，而 (d_L) 则不增加。 因此，女孩（x）可以在以下情况下被接受：

 [
 \max_{R\ge x}c_R < \min_{L\le x}d_L。 
]

 接受她后，我们将(1)添加到后缀(c_x,\ldots,c_n)，并将(1)添加到后缀(d_{x+1},\ldots,d_n)。 

因此，我们需要一棵线段树通过范围添加来维护 (c) 的后缀最大值，并需要另一棵线段树通过范围添加来维护 (d) 的前缀最小值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n(n+t))) | (O(n+t)) | 太慢了 |
 | 加权匹配/流量| 至少在全区间图中是超线性的 | 潜在 (O(nt)) | 太慢了 |
 | 贪心 + 两个惰性线段树 | (O(t+n+n\log n)) | (O(t+n)) | 已接受 |

 ## 算法演练

1. 计算前缀容量 (A_x)，其中 (A_x) 是 (1) 到 (x) 天的日期槽总数。 这使得每个容量区间 ([u,v]) 在恒定时间内被评估为 (A_v-A_{u-1})。 
2. 对于每个女孩(i)，最初没有选择女孩，所以(B_i=0)。 商店

 [
 c_i=-A_{r_i}
 ]

 和

 [
 d_i=-A_{l_i-1}。 
]

 这些正是前面所有 (b_i=0) 的定义。 

1. 按照快乐程度的高低对女孩进行排序。 所选集合在横向拟阵中是独立的，因此按此顺序接受每个可行女孩会产生最大权重可行集合。 
2. 考虑下一个女孩（x）。 查询

 [
 C=\max_{i\ge x}c_i
 ]

 从第一段树和

 [
 D=\min_{i\le x}d_i
 ]

 从第二个线段树。 

1. 如果 (C<D)，则接受女孩 (x)。 严格的不平等是必要的，因为接受她会使每个相关的 (c_i) 恰好增加 1。 旧的不平等必须至少有一个单位的松弛。 
2. 如果女孩 (x) 被接受，则将 (1) 添加到 (c_x,\ldots,c_n)。 这反映出每个 (B_i) 和 (i\ge x) 都会加一。 
3. 还将 (1) 添加到 (d_{x+1},\ldots,d_n)。 值(d_i)包含(B_{i-1})，因此仅当(i-1\ge x)时才改变。 故意不更新 (d_x)。 
4. 将女孩的快乐添加到答案中，然后继续回答下一个女孩。 如果女孩未通过测试，则保持两棵树不变并继续前进。 

不变的是，在处理了快乐排序顺序的任何前缀之后，这两棵树准确地代表了接受的女孩的 (c_i) 和 (d_i) 值。 每对 (L\le R) 的条件都已满足。 当考虑一个新女孩时，只有 (L\le x\le R) 的不等式会变得更紧。 当右侧最大的旧值 (c_R) 严格小于左侧的最小旧值 (d_L) 时，这些不等式在插入后有效。 因此，每个被接受的集合都是可行的，并且每个被拒绝的女孩如果添加的话都会违反霍尔的条件。 由于可行性系统是拟阵，并且女孩是通过减轻体重来处理的，因此最终的组合具有最大的总乐趣。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

INF = 10**30

class SegmentTree:
    def __init__(self, values, is_max):
        self.n = len(values)
        self.is_max = is_max
        size = 4 * self.n + 5
        self.val = array('q', [0]) * size
        self.tag = array('q', [0]) * size
        self.values = values
        self._build(1, 0, self.n - 1)

    def _merge(self, x, y):
        if self.is_max:
            return x if x > y else y
        return x if x < y else y

    def _build(self, v, l, r):
        if l == r:
            self.val[v] = self.values[l]
            return
        m = (l + r) >> 1
        self._build(v << 1, l, m)
        self._build(v << 1 | 1, m + 1, r)
        self.val[v] = self._merge(
            self.val[v << 1],
            self.val[v << 1 | 1]
        )

    def update_suffix(self, pos, delta=1):
        if pos >= self.n:
            return
        self._update(1, 0, self.n - 1, pos, delta)

    def _update(self, v, l, r, pos, delta):
        if pos <= l:
            self.val[v] += delta
            self.tag[v] += delta
            return

        m = (l + r) >> 1

        if pos <= m:
            self._update(v << 1, l, m, pos, delta)
        self._update(v << 1 | 1, m + 1, r, pos, delta)

        self.val[v] = self._merge(
            self.val[v << 1],
            self.val[v << 1 | 1]
        ) + self.tag[v]

    def query_suffix(self, pos):
        if pos >= self.n:
            return -INF if self.is_max else INF
        return self._query_suffix(1, 0, self.n - 1, pos)

    def _query_suffix(self, v, l, r, pos):
        if pos <= l:
            return self.val[v]

        m = (l + r) >> 1

        if pos <= m:
            left = self._query_suffix(v << 1, l, m, pos)
            right = self.val[v << 1 | 1]
            return self._merge(left, right) + self.tag[v]

        return self._query_suffix(v << 1 | 1, m + 1, r, pos) + self.tag[v]

    def query_prefix(self, pos):
        if pos < 0:
            return -INF if self.is_max else INF
        if pos >= self.n - 1:
            return self.val[1]
        return self._query_prefix(1, 0, self.n - 1, pos)

    def _query_prefix(self, v, l, r, pos):
        if r <= pos:
            return self.val[v]

        m = (l + r) >> 1

        if pos <= m:
            return self._query_prefix(v << 1, l, m, pos) + self.tag[v]

        left = self.val[v << 1]
        right = self._query_prefix(v << 1 | 1, m + 1, r, pos)
        return self._merge(left, right) + self.tag[v]

def solve():
    n, t = map(int, input().split())

    pref = [0] * (t + 1)
    cur = 0
    a = list(map(int, input().split()))

    for i, x in enumerate(a, 1):
        cur += x
        pref[i] = cur

    order = [None] * n
    c = [0] * n
    d = [0] * n

    for i in range(n):
        l, r, p = map(int, input().split())
        order[i] = (p, i)
        c[i] = -pref[r]
        d[i] = -pref[l - 1]

    order.sort(reverse=True)

    tree_c = SegmentTree(c, True)
    tree_d = SegmentTree(d, False)

    del c
    del d
    del pref
    del a

    ans = 0

    for p, x in order:
        right_c = tree_c.query_suffix(x)
        left_d = tree_d.query_prefix(x)

        if right_c < left_d:
            tree_c.update_suffix(x)
            tree_d.update_suffix(x + 1)
            ans += p

    print(ans)

if __name__ == "__main__":
    solve()
```首先构建前缀数组，因为每个女孩的初始 (c_i) 和 (d_i) 仅取决于她右边或左端点之前的总容量。 一旦这些值被初始化，就不再需要原来的(l_i)和(r_i)。 

这`order`数组仅存储`(pleasure, index)`。 反向排序会带来递减的快乐，这正是拟阵贪婪算法所要求的顺序。 Python 整数是任意精度的，因此总长度和前缀容量不会带来 32 位溢出的风险。 

线段树使用了一种稍微不寻常的惰性传播风格。`val[v]`已经包含属于节点 (v) 的惰性更新，而`tag[v]`记录尚未并入子项的金额。 当下降到子级时，父级的标记将添加到子级的返回值中。 重建父级时，合并的子级值会增加父级的标记。 这避免了显式的推送操作并使后缀更新特别紧凑。 

第一棵树是 (c) 的范围添加、范围最大结构。 第二个是 (d) 的范围添加、范围最小结构。 候选测试精确查询出现在的两个范围

 [
 \max_{R\ge x}c_R < \min_{L\le x}d_L。 
]

 接受后，(c) 的后缀更新从 (x) 开始，而 (d) 的后缀更新从 (x+1) 开始。 这一指数差异至关重要，也是实施过程中最有可能出现的差一错误。 

## 工作示例

 ### 示例 1

 实际的样本输入是：```
3 5
0 1 0 1 0
1 2 2
2 4 1
3 5 5
```前缀容量为

 [
 A=[0,0,1,1,2,2]。 
]

 初始 (c_i=-A_{r_i}) 和 (d_i=-A_{l_i-1}) 为：

 [
 c=[-1,-2,-2],
 \qquad
 d=[0,0,-1]。 
]

 女孩们按照快乐顺序（3、1、2）进行考虑。 

| 女孩| 快乐| (x)| (\max c[x..]) | (\max c[x..]) | (\min d[..x]) | 决定| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 3 | 5 | 2 | (-2) | (-1) | 接受 | 5 |
 | 1 | 2 | 0 | (-1) | (0) | 接受 | 7 |
 | 2 | 1 | 1 | (0) | (0) | 拒绝 | 7 |

 对于女孩（3），（-2<-1），所以有足够的松弛来插入她。 接受她后，(c_3) 加一。 女孩（1）也适合。 当考虑女孩（2）时，两侧相等，因此插入她将使某些霍尔不等式失败一个单位。 最终的答案是`7`。 这说明了为什么验收测试如此严格。 

### 重边界示例

 考虑：```
2 2
1 0
1 1 100
1 2 99
```前缀容量为 (A=[0,1,1])。 最初，

 [
 c=[-1,-1],\qquad=[0,0]。 
]

 | 女孩| 快乐| (x)| (\max c[x..]) | (\max c[x..]) | (\min d[..x]) | 决定| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 100 | 100 0 | (-1) | (0) | 接受 | 100 | 100
 | 2 | 99 | 99 1 | (0) | (0) | 拒绝 | 100 | 100

 接受女孩（1）后，唯一的容量槽被消耗。 女孩 (2) 与相同的有效容量重叠，因为第 (2) 天的容量为零，因此第二个候选者同样失败。 输出是`100`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(t+n+n\log n)) | 前缀和需要 (O(t))，排序需要 (O(n\log n))，每个女孩执行恒定数量的 (O(\log n)) 线段树操作 |
 | 空间| (O(t+n)) | 前缀容量、排序候选和两段树都使用线性内存 |

 对于 (n,t\le300000)，主导项是 (O(n\log n))，这适用于两秒目标。 线段树在 Python 实现中使用紧凑的 64 位数组，而不是普通的 Python 整数数组，从而控制内存使用。 

## 测试用例```python
import sys
import io
from array import array

input = sys.stdin.readline

INF = 10**30

class SegmentTree:
    def __init__(self, values, is_max):
        self.n = len(values)
        self.is_max = is_max
        size = 4 * self.n + 5
        self.val = array('q', [0]) * size
        self.tag = array('q', [0]) * size
        self.values = values
        self._build(1, 0, self.n - 1)

    def _merge(self, x, y):
        if self.is_max:
            return x if x > y else y
        return x if x < y else y

    def _build(self, v, l, r):
        if l == r:
            self.val[v] = self.values[l]
            return
        m = (l + r) >> 1
        self._build(v << 1, l, m)
        self._build(v << 1 | 1, m + 1, r)
        self.val[v] = self._merge(
            self.val[v << 1],
            self.val[v << 1 | 1]
        )

    def update_suffix(self, pos):
        if pos >= self.n:
            return
        self._update(1, 0, self.n - 1, pos)

    def _update(self, v, l, r, pos):
        if pos <= l:
            self.val[v] += 1
            self.tag[v] += 1
            return

        m = (l + r) >> 1

        if pos <= m:
            self._update(v << 1, l, m, pos)
        self._update(v << 1 | 1, m + 1, r, pos)

        self.val[v] = self._merge(
            self.val[v << 1],
            self.val[v << 1 | 1]
        ) + self.tag[v]

    def query_suffix(self, pos):
        if pos >= self.n:
            return -INF if self.is_max else INF
        return self._query_suffix(1, 0, self.n - 1, pos)

    def _query_suffix(self, v, l, r, pos):
        if pos <= l:
            return self.val[v]

        m = (l + r) >> 1

        if pos <= m:
            left = self._query_suffix(v << 1, l, m, pos)
            right = self.val[v << 1 | 1]
            return self._merge(left, right) + self.tag[v]

        return self._query_suffix(v << 1 | 1, m + 1, r, pos) + self.tag[v]

    def query_prefix(self, pos):
        if pos < 0:
            return -INF if self.is_max else INF
        if pos >= self.n - 1:
            return self.val[1]
        return self._query_prefix(1, 0, self.n - 1, pos)

    def _query_prefix(self, v, l, r, pos):
        if r <= pos:
            return self.val[v]

        m = (l + r) >> 1

        if pos <= m:
            return self._query_prefix(v << 1, l, m, pos) + self.tag[v]

        left = self.val[v << 1]
        right = self._query_prefix(v << 1 | 1, m + 1, r, pos)
        return self._merge(left, right) + self.tag[v]

def solve_case(inp):
    data = iter(inp.split())
    n = int(next(data))
    t = int(next(data))

    pref = [0] * (t + 1)
    for i in range(1, t + 1):
        pref[i] = pref[i - 1] + int(next(data))

    order = [None] * n
    c = [0] * n
    d = [0] * n

    for i in range(n):
        l = int(next(data))
        r = int(next(data))
        p = int(next(data))
        order[i] = (p, i)
        c[i] = -pref[r]
        d[i] = -pref[l - 1]

    order.sort(reverse=True)

    tc = SegmentTree(c, True)
    td = SegmentTree(d, False)

    ans = 0

    for p, x in order:
        if tc.query_suffix(x) < td.query_prefix(x):
            tc.update_suffix(x)
            td.update_suffix(x + 1)
            ans += p

    return str(ans)

def run(inp: str) -> str:
    return solve_case(inp)

# Provided sample.
assert run("""\
3 5
0 1 0 1 0
1 2 2
2 4 1
3 5 5
""") == "7", "sample 1"

# Minimum-size case with zero capacity.
assert run("""\
1 1
0
1 1 5
""") == "0", "minimum size and zero capacity"

# All girls have the same interval and compete for one slot.
assert run("""\
2 1
1
1 1 5
1 1 4
""") == "5", "shared single capacity"

# Boundary case where day 2 has no capacity.
assert run("""\
2 2
1 0
1 1 100
1 2 99
""") == "100", "Hall constraint across a boundary"

# All values equal, with enough total capacity for every girl.
assert run("""\
4 2
2 2
1 2 10
1 2 10
1 2 10
1 2 10
""") == "40", "all equal values"

# Maximum-size construction.
n = 300000
parts = [f"{n} {n}\n", ("1 " * (n - 1)) + "1\n"]
for i in range(1, n + 1):
    parts.append(f"{i} {i} 1\n")

large_input = "".join(parts)
assert run(large_input) == "300000", "maximum-size instance"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 0 / 1 1 5`|`0`| 最小尺寸和零容量 |
 |`2 1 / 1 / 1 1 5 / 1 1 4`|`5`| 多个女孩争夺一个位置|
 |`2 2 / 1 0 / 1 1 100 / 1 2 99`|`100`| 全局霍尔约束和端点处理|
 |`4 2 / 2 2 / four [1,2] intervals`|`40`| 等间隔，等乐趣，容量充足|
 | (n=t=300000)，单位容量和([i,i])间隔|`300000`| 最大输入大小和线性内存行为 |

 ## 边缘情况

 当每个容量都为零时，每个初始(c_i)和(d_i)都为零。 对于位置 (x) 的女孩，测试将后缀最大值为零与前缀最小值零进行比较。 由于 (0<0) 为假，因此没有人被接受。 为了```
1 1
0
1 1 10
```算法返回`0`，完全按照要求。 

当几个女孩共享一天时，第一个可以接受，但下一个必须失败。 为了```
2 1
1
1 1 5
1 1 4
```第一个候选满足 (-1<0)。 接受她后，相关的（c）值变为零。 然后第二个候选人将 (0<0) 视为错误并被拒绝。 结果是`5`。 

全局霍尔约束出现在```
2 2
1 0
1 1 100
1 2 99
```在接受第一个女孩后，第二个候选人在基于 1 的索引中有 (x=2)。 右侧最大值 (c) 和左侧最小值 (d) 相等，因此候选者被拒绝。 线段树检测到两个女孩总共需要的容量超出了白天所能提供的容量，尽管每个女孩单独看起来都是可行的。 

对于相等的间隔，该算法不依赖于不同的端点。 考虑四个女孩，每个女孩的间隔 ([1,2])、能力 (2,2) 和快乐 (10)。 每个候选人都会通过，因为正好有四个可用位置。 后缀更新正确累积了四个接受的女孩，答案变成`40`。 

在右边界，接受最后一个女孩一定不会更新(d_n)，因为(d_n)包含(B_{n-1})，而不是(B_n)。 这就是执行执行的原因`tree_d.update_suffix(x + 1)`而不是`tree_d.update_suffix(x)`。 对于最终位置的女孩来说，这个更新是完全跳过的。 该边界使前缀表达式 (B_{L-1}-A_{l_L-1}) 与霍尔不等式保持一致。 

最大尺寸的箱子有（300000）个女孩和（300000）天，每天一个容量单位，女孩（i）仅限于第（i）天。 每个女孩都是独立可安排的，所以所有（300000）个女孩都被接受，答案是`300000`。 该算法在 (O(n\log n)) 时间内处理此问题，同时保持线段树存储线性。
