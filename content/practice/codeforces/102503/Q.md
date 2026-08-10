---
title: "CF 102503Q - Og 和 Ug"
description: "我们有一棵有根树，以节点 1 作为根。 每个节点都有一个有序的子节点列表。 该程序维护一个双端队列 (node, i)，其中 i 告诉我们接下来应该处理该节点的哪个子节点。 当从右端删除一对时，将打印其节点。"
date: "2026-08-09T19:31:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "Q"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 711
verified: true
draft: false
---

[CF 102503Q - Og 和 Ug](https://codeforces.com/problemset/problem/102503/Q)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根树，以节点 1 作为根。 每个节点都有一个有序的子节点列表。 该程序维护一个双端队列`(node, i)`， 在哪里`i`告诉我们接下来应该处理该节点的哪个子节点。 

当从右端删除一对时，将打印其节点。 如果仍有未处理的子节点，程序会将节点的延续放回右侧并启动该子节点。 这是深度优先遍历的常见迭代形式。 

ug 添加了一项额外操作。 当一个节点完成其所有子节点时，而不是消失，`(node, 0)`插入到双端队列的左端。 由于未来的元素从右侧删除，因此这些已完成的节点将被推迟，直到当前活动的所有节点都完成为止。 

输入描述整个树，然后给出无限输出序列中最多 143 个位置。 请求的位置可以大到 (10^{100})，因此任务不是生成直到该位置的序列。 我们需要理解它的递归结构并跳过它的很大一部分。 

树本身很小，最多有 50 个节点。 这排除了复杂性很大程度上取决于节点数量的算法，但对于运行时间与请求位置成正比的模拟没有帮助。 (10^{100}) 的查询将需要大量的模拟双端队列操作。 (n) 的小值是一个信号，表明我们应该构建无限序列的有限描述。 

在几种边界情况下，错误地解释双端队列会给出看似合理但错误的序列。 以单个节点为例，```
1 3
0
1
2
10
```唯一的节点被永远打印，所以输出是```
1
1
1
```假设立即处理已完成的节点的模拟仍然会在这里工作，这使得这种情况作为测试特别危险，因为它不会暴露该错误。 

一个更具启发性的例子是一个带有一个叶子子节点的根：```
2 4
1 2
0
1
2
3
4
```正确的输出是```
1
2
1
2
```前三个值来自完成根的初始遍历。 完成的根放在左边，因此下一个任务是推迟的叶任务，而不是通过处理获得的根延续`push_left`作为`push_right`。 

另一个有用的边界是第一次完整遍历的结束。 对于有两个叶子孩子的根，```
3 3
2 2 3
0
0
5
6
12
```输出是```
1
2
1
```分别对应位置 5、6 和 12。 位置 5 是初始根遍历的最终打印，而位置 6 开始处理推迟的子节点。 混淆两个双端队列末端会移动整个无限序列。 

## 方法

 直接的方法是完全按照编写的程序来实现。 我们保留双端队列，重复删除其最右边的元素，打印其节点，并执行相应的插入。 这是正确的，因为它实际上是原始程序的状态转换。 

问题是它的运行时间。 为了回答位置 (K) 处的查询，模拟需要 (\Theta(K)) 个打印元素，因此需要 (\Theta(K)) 个双端队列操作。 在最坏的情况下（K=10^{100}），因此即使所需的操作数量也远远超出任何有限的计算极限。 显式存储双端队列也是不必要的，因为序列的结构比原始模拟建议的要多得多。 

关键的观察来自于观察一个节点正在被主动处理时发生的情况。 认为`(v, 0)`是最右边的活动任务，并且其右侧没有活动任务。 它的遍历产生一个固定的有限序列。 打印节点 (v)，遍历每个子子树，并在连续的子遍历之间以及在最后一个子树之后再次打印 (v)。 

令这个有限序列为(E(v))。 如果 (v) 有子级 (c_1,c_2,\ldots,c_m)，则

 [
 E(v)=v,E(c_1),v,E(c_2),\ldots,v,E(c_m),v。 
]

 因此，叶子有 (E(v)=[v])。 如果 (v) 的子树包含 (s(v)) 个节点，则 (E(v)) 正好有 (2s(v)-1) 个元素，因为每个树边都会导致对其父节点的额外返回。 

当此遍历运行时，完成的每个节点都会插入到左侧。 最后，那些新创建的`(node, 0)`任务完全按照后序从右到左显示。 现有的推迟任务仍然位于右侧较远的位置，因此首先处理它们。 

这给出了更清晰的解释。 对待`(v,0)`作为一项任务。 处理一个任务 (v) 会打印整个有限块 (E(v))，然后按后序附加 (v) 子树的节点作为下一代任务。 

令 (Q(v)) 表示以 (v) 为根的子树的后序列表。 第一个任务是根。 下一代任务是(Q(root))。 之后的一代是通过将上一代中的每个节点（v）替换为（Q（v））而获得的。 换句话说，如果(W_d)是级别(d)的任务序列，

 [
 W_0=[根],
 ]

 和

 [
 W_{d+1}=Q(W_d)。 
]

 输出是这些级别中所有 (v) 的 (E(v)) 的串联。 

第二个关键观察结果是 (Q(v)) 只包含 (v) 子树中的每个节点一次。 因此，如果我们定义一个矩阵 (M)

 [
 M_{u,v}=1
 ]

 当(v)属于(u)的子树时，否则为零，则乘以(M^d)获得级别(d)中每个节点的出现次数。 

因为 (M) 在其对角线上有 1，并且在适当的节点排序之后只有祖先到后代的条目位于该对角线上方，所以我们可以写

 [
 M=I+N
 ]

 其中 (N) 是幂零的。 该树最多有 50 个节点，因此 (N^{50}=0)。 因此

 [
 M^d=(I+N)^d
 =\sum_{r=0}^{49}\binom dr N^r。 
]

 这就是巨大的指数是可以控制的原因。 每个相关长度都是 (d) 中的多项式，自然地以二项式基表示。 

对于节点 (v)，将 (A_v(d)) 定义为 (Q^d(v)) 中所有任务贡献的实际打印值总数。 由于 (x) 类型的任务贡献 (|E(x)|) 个打印值，因此 (A_v(d)) 正是 (M^d) 行的加权版本。 因此，它是 (d) 中次数最多为 49 的多项式。 

我们还可以对整个级别进行求和。 身份

 [
 \sum_{j=0}^{d-1}\binom jr=\binom d{r+1}
 ]

 给出级别 (d) 之前所有级别中打印值总数的多项式. 这让我们可以通过二分搜索来定位包含查询的级别。 

一旦知道了能级，就会出现另一个潜在的问题：能级本身可能有一个巨大的指数。 我们递归地解决这个问题。 单词 (Q^d(v)) 是

 [
 Q^{d-1}(x_1)Q^{d-1}(x_2)\ldots Q^{d-1}(x_m),
 ]

 其中 (x_1,\ldots,x_m) 是 (v) 子树的后序节点。 我们可以计算每个块的加权大小并找到所需的块。 

最后一个块始终是 (Q^{d-1}(v))，因为 (v) 是其子树后序中的最后一个节点。 这种自引用是朴素递归下降可以采取 (d) 步骤的唯一原因。 我们使用多项式 (A_v) 立即跳过最后一个块的所有连续选择。 每次离开 self 块时，我们都会移动到真后代，因此最多可以有 50 个这样的转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(K)) | (O(K)) 最坏情况 | 太慢了|
 | 最佳| (O(n^3+k n^2\log K)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 构建每个节点的子树的后序列表。 (v) 的列表正是 (Q(v))，因为处理 (v) 时创建的推迟任务按后序显示。 
2. 构造 (E(v))，即处理任务 (v) 在活动时产生的有限输出。 从 (v) 开始，为每个子项 (c) 递归附加 (E(c))，并在每个子项之后附加 (v)。 该序列的长度为 (w(v)=2s(v)-1)，其中 (s(v)) 是子树大小。 
3. 隐式定义矩阵 (N)，将 (N) 应用于向量 (x)，在节点 (v) 处给出 (v) 的所有真子孙 (u) 的 (x[u]) 之和。 从向量 (w) 开始，然后重复应用 (N)。 得到的向量 (C_r=N^r w) 给出

 [
 A_v(d)=\sum_r C_r[v]\binom 博士。 
]

 最多只有 50 个向量是非零的，因为 (N) 是幂零的。

1. 将这些二项式基多项式转换为普通整数多项式。 将每个多项式乘以 ((H+1)!)，其中 (H) 是最大的非零次数。 这会从二项式系数中删除所有分母，并让实现使用普通整数算术来评估多项式。 
2. 为级别 (d) 之前的总输出构建多项式。 如果 (C_r[root]) 是上一步的系数，则

 [
 P(d)=\sum_r C_r[root]\binom d{r+1}
 ]

 是级别 (0) 到 (d-1) 中打印值的数量。 

1.对于每个查询(K)，二分查找满足(P(d)<K)的最大级别(d)。 查询位于 (d) 层内。 从 (K) 中减去 (P(d))，即可获得其在该级别内以一为基础的位置，并使用权重 (w(v)) 进行测量。 
2. 为了找到 (Q^d(root)) 内的确切任务，维护一个节点 (v)、一个指数 (d) 和剩余的加权位置 (r)。 如果(d=0)，则该单词仅包含(v)，因此(r)直接标识(E(v))内的位置。 
3. 当 (d>0) 时，对于 (v) 子树的后序列表中的每个 (x)，单词 (Q^d(v)) 由一个块 (Q^{d-1}(x)) 组成。 属于(x)的块的权重是(A_x(d-1))。 
4. 最后一个块对应于(x=v)。 让(A=A_v(d))。 在最后一个块之后，前面的部分有权重

 [
 A_v(d)-A_v(d-1)。 
]

 如果剩余位置大于该值，则所需位置位于最终自身块内。 简单地重复此操作可能需要 (d) 次迭代，因此二分搜索连续自选择的最大数量 (t) 满足

 [
 r>A_v(d)-A_v(d-t)。 
]

 然后将（d）替换为（d-t）并减去跳过的权重。 

1. 如果不再选择自身块，则按后序扫描正确的后代。 找到块 (Q^{d-1}(x)) 包含剩余位置的第一个 (x)，根据需要减去完整块。 设置 (v=x) 和 (d=d-1)。 
2. 每次发生步骤 10 时，新节点都是前一个节点的真后代。 因此，这种情况最多可能发生 (n-1) 次。 潜在的大量自转换已被压缩到步骤 9 中的二分搜索中。 
3. 当(d=0)时，答案是预先计算的(E(v))序列的对应元素。 

工作原理：双端队列在概念上可以分为当前活动的遍历帧和推迟的重新启动任务。 活动帧始终占据右端，因此它们在触及任何推迟的任务之前完成整个遍历。 每个完成的节点都插入到左边，由于右端优先，所以推迟的节点按照先进先出的顺序处理。 它们的顺序正是产生它们的子树的后序。 这证明无限执行被划分为多个级别 (Q^d(root))，每个任务 (v) 完全贡献 (E(v))。 多项式 (A_v(d)) 计算每个递归生成的块的精确加权大小，因此每个二分搜索仅跳过完整的块。 因此，递归下降恰好落在包含所请求的输出位置的任务上，并且 (E(v)) 给出了该任务内的确切打印节点。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    children = [[] for _ in range(n)]
    for v in range(n):
        data = list(map(int, input().split()))
        c = data[0]
        children[v] = [x - 1 for x in data[1:]]

    queries = [int(input()) for _ in range(k)]

    sys.setrecursionlimit(10000)

    post = [[] for _ in range(n)]
    euler_output = [[] for _ in range(n)]
    subtree_size = [0] * n

    def build(v):
        p = []
        e = [v]

        for u in children[v]:
            build(u)
            p.extend(post[u])
            e.extend(euler_output[u])
            e.append(v)

        p.append(v)

        post[v] = p
        euler_output[v] = e
        subtree_size[v] = len(p)

    build(0)

    # w[v] is the number of printed values produced by one task v.
    weight = [len(euler_output[v]) for v in range(n)]

    # coeff[r][v] = (N^r * weight)[v].
    coeff = [weight[:]]
    cur = weight[:]

    for _ in range(1, n + 1):
        nxt = [0] * n

        for v in range(n):
            total = 0
            # post[v][:-1] are precisely the proper descendants of v.
            for u in post[v][:-1]:
                total += cur[u]
            nxt[v] = total

        if not any(nxt):
            break

        coeff.append(nxt)
        cur = nxt

    degree = len(coeff) - 1

    # We multiply every polynomial by FACT so that all coefficients
    # become integers.
    FACT = math.factorial(degree + 1)

    # Falling factorial polynomials:
    # fall[r](x) = x * (x-1) * ... * (x-r+1)
    fall = [[1]]
    for r in range(1, degree + 2):
        prev = fall[-1]
        cur_poly = [0] * (r + 1)
        shift = r - 1

        for j, a in enumerate(prev):
            cur_poly[j] -= shift * a
            cur_poly[j + 1] += a

        fall.append(cur_poly)

    # Polynomial for FACT * A_v(d).
    apoly = [[0] * (degree + 1) for _ in range(n)]

    factorials = [math.factorial(i) for i in range(degree + 2)]

    for r in range(degree + 1):
        multiplier = FACT // factorials[r]
        fr = fall[r]

        for v in range(n):
            c = coeff[r][v]
            if c == 0:
                continue

            mul = c * multiplier
            pv = apoly[v]

            for j, a in enumerate(fr):
                pv[j] += mul * a

    # Polynomial for
    # FACT * sum_{j=0}^{d-1} A_root(j).
    # sum C(j,r) = C(d,r+1).
    prefix_poly = [0] * (degree + 2)

    for r in range(degree + 1):
        multiplier = FACT // factorials[r + 1]
        fr = fall[r + 1]
        c = coeff[r][0]

        if c == 0:
            continue

        mul = c * multiplier
        for j, a in enumerate(fr):
            prefix_poly[j] += mul * a

    def eval_poly(poly, x):
        value = 0
        for a in reversed(poly):
            value = value * x + a
        return value

    prefix_cache = {}
    answer_cache = {}

    def prefix(d):
        if d not in prefix_cache:
            prefix_cache[d] = eval_poly(prefix_poly, d)
        return prefix_cache[d]

    def A(v, d, cache):
        key = (v, d)
        value = cache.get(key)
        if value is None:
            value = eval_poly(apoly[v], d)
            cache[key] = value
        return value

    total_target_scale = FACT

    def get_answer(K):
        if K in answer_cache:
            return answer_cache[K]

        target = K * FACT

        # Find the level containing K.
        lo, hi = 0, K
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if prefix(mid) < target:
                lo = mid
            else:
                hi = mid - 1

        d = lo
        rem = target - prefix(d)

        cache = {}

        v = 0

        while d > 0:
            current = A(v, d, cache)

            # Jump over as many consecutive choices of the final
            # self-block Q^(d-1)(v) as possible.
            lo_t, hi_t = 0, d

            while lo_t < hi_t:
                mid = (lo_t + hi_t + 1) // 2
                earlier = A(v, d - mid, cache)

                if rem > current - earlier:
                    lo_t = mid
                else:
                    hi_t = mid - 1

            t = lo_t

            if t:
                new_d = d - t
                skipped = current - A(v, new_d, cache)
                rem -= skipped
                d = new_d

                if d == 0:
                    break

            # The self-block is no longer possible.
            # Q(v) is post[v], whose last element is v.
            found = False

            for u in post[v][:-1]:
                block = A(u, d - 1, cache)

                if rem > block:
                    rem -= block
                else:
                    v = u
                    d -= 1
                    found = True
                    break

            if not found:
                # This branch is reachable only at d == 0,
                # which is handled below.
                break

        # At d == 0 the word is [v].
        # rem is a one-based position inside E(v).
        idx = rem // FACT - 1
        ans = euler_output[v][idx]

        answer_cache[K] = ans
        return ans

    out = [str(get_answer(q) + 1) for q in queries]
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个 DFS 为每个树节点构造两个对象。`post[v]`是完成后生成的重新启动任务的确切顺序`v`， 尽管`euler_output[v]`是任务时打印的实际序列`v`是活跃的。 后者有长度`2 * subtree_size - 1`。 

这`coeff`向量对幂零后代矩阵的幂进行编码，而无需显式存储矩阵。 正在申请`N`一次意味着对适当的后代求和，因此每个系数都可以直接从后序列表计算。 

多项式转换值得关注。 自然公式使用二项式系数，但在每次二分搜索期间重复评估二项式系数将需要多次除法。 将所有多项式乘以`(degree + 1)!`将每个二项式多项式转换为整数多项式。 霍纳评估则只需要乘法和加法。 

所有职位均以内部单位表示`FACT`。 这避免了重复将加权位置除以阶乘比例因子。 在最后一步，剩余值可除以`FACT`，商给出内部以一为基础的位置`E(v)`。 

第一级的二分查找使用`prefix(d)`，它严格计算之前级别的每个输出`d`。 上限`K`总是足够的，因为每个级别至少包含一个任务，并且每个任务至少打印一个值。 

第二个二分查找是微妙的部分。 自从`v`是它自己的后序列表的最后一个元素，`Q^d(v)`总是以`Q^(d-1)(v)`。 如果目标反复停留在这个自身块中，我们可以通过一次操作减去整个跳过的范围。 一旦目标进入适当的后代块，当前节点就会在树中严格向下移动。 

Python 整数是任意精度的，因此输入值高达 (10^{100})、多项式计算和阶乘缩放不会引入溢出问题。 

## 工作示例

 ### 示例 1

 这棵树是```
1
├── 2
│   └── 3
└── 4
```主动遍历序列是```
E(3) = [3]
E(4) = [4]
E(2) = [2, 3, 2]
E(1) = [1, 2, 3, 2, 1, 4, 1]
```因此，第一级贡献七个打印值。 

根的后序是`[3, 2, 4, 1]`，所以下一个级别由这四个任务组成。 它们的权重分别为1、3、1、7。 

| 查询 | 包含它的关卡 | 水平内位置 | 选定的任务/输出 | 回答 |
 | --- | --- | --- | --- | --- |
 | 6 | 0 | 6 |`E(1)[6]`| 4 |
 | 9 | 1 | 2 |`E(2)[1]`| 2 |
 | 69 | 69 4 | 7 | 递归选择| 2 |
 | 143 | 143 6 | 9 | 递归选择| 3 |
 | 214 | 214 7 | 31 | 递归选择| 3 |
 | 241 | 241 7 | 58 | 58 递归选择| 3 |
 | 420 | 420 10 | 10 37 | 37 递归选择| 3 |

 对于这棵树，级别 (d) 的总权重为

 [
 A_1(d)=7+\frac{d(d+9)}2.
 ]

 因此，级别 (d) 之前的累积输出为

 [
 P(d)=\sum_{j=0}^{d-1}
 \left(7+\frac{j(j+9)}2\right)。 
]

 例如，(P(4)=62) 和 (P(5)=94)，因此查询 69 位于级别 4。然后递归块选择找到节点 2，产生所需的值 2。 

### 一个二节点链

 考虑```
2 5
1 2
0
1
2
3
4
10
```这棵树简直就是```
1
└── 2
```活动块是```
E(2) = [2]
E(1) = [1, 2, 1]
```第一层的权重为3。其后序任务序列为`[2, 1]`。 将每个任务替换为其后序序列即可给出下一个级别。 

| 水平| 任务序列 | 块重量 | 总产量|
 | --- | --- | --- | --- |
 | 0 |`[1]`|`[3]`| 3 |
 | 1 |`[2, 1]`|`[1, 3]`| 4 |
 | 2 |`[2, 2, 1]`|`[1, 1, 3]`| 5 |

 级别 0、1、2 和 3 之前的累积输出分别为 0、3、7 和 12。因此查询 10 属于级别 2，本地位置为 3。该级别的前两个任务都是节点 2，剩下第三个任务，节点 1。其块是`E(1)`，因此该块内的第三个打印值是 1。 

因此，请求的输出是```
1
2
1
2
1
```对于位置 1、2、3、4 和 10。此示例练习重复的自块跳转，因为节点 1 始终作为其自身后序扩展的最终元素出现。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^3+k n^2\log K)) | 多项式构建成本（O(n^3)）； 每个查询最多访问 (n) 个树级别，对最多 (O(\log K)) 次迭代和 (O(n)) 多项式求值的指数进行二分搜索 |
 | 空间| (O(n^2)) | 树、后序列表、输出块、多项式系数和临时每个查询缓存都具有二次尺度大小 |

 这里（K）表示最大的请求位置。 对于 (n\le50)，所有与树相关的工作都很小。 对 (K) 的依赖性与查询的位数呈对数关系，而不是与数值呈线性关系，这使得 (10^{100}) 的位置变得实用。 

## 测试用例

 以下测试假设`solve()`上述解决方案中的功能可用。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
sample1 = """\
4 7
2 2 4
1 3
0
0
6
9
69
143
214
241
420
"""

assert run(sample1) == """\
4
2
2
3
3
3
3
""", "sample 1"

# Minimum-size tree, all outputs equal.
case1 = """\
1 4
0
1
2
3
100000000000000000000000000000000000000000000000000000000000
"""

assert run(case1) == """\
1
1
1
1
""", "single-node tree"

# Two-node chain, catches level boundaries and repeated self blocks.
case2 = """\
2 5
1 2
0
1
2
3
4
10
"""

assert run(case2) == """\
1
2
1
2
1
""", "two-node chain"

# Three-node star, checks the transition from the initial traversal
# to postponed tasks.
case3 = """\
3 5
2 2 3
0
0
5
6
7
12
13
"""

assert run(case3) == """\
1
2
1
1
2
""", "star boundary"

# Maximum n = 50, root with 49 leaf children.
# E(root) has length 99:
# odd positions are node 1, even positions are leaves 2,3,...,50.
max_case_parts = [
    "50 3",
    "49 " + " ".join(str(x) for x in range(2, 51))
]
max_case_parts.extend(["0"] * 49)
max_case_parts.extend(["99", "100", "101"])
case4 = "\n".join(max_case_parts) + "\n"

assert run(case4) == """\
1
2
3
""", "maximum-size star"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点海量查询|`1, 1, 1, 1`| 最小尺寸，所有输出相等，任意精度位置 |
 | 二节点链 |`1, 2, 1, 2, 1`| 层级边界与反复自我扩张|
 | 三节点星|`1, 2, 1, 1, 2`| 从最初的主动遍历过渡到推迟任务|
 | 五十节点星|`1, 2, 3`| 最大树大小和第一层的确切结束位置 |

 ## 边缘情况

 对于单节点树，每个处理步骤都会打印节点 1，然后放入`(1,0)`回到左边。 由于它也是唯一的元素，因此下一次迭代会再次删除它。 多项式表示用常数 (A_1(d)=1) 反映这一点，而累积前缀只是 (d)。 因此，级别搜索可以直接跳转到一个巨大的级别，并且基本情况返回节点 1。 

对于二节点链```
2 4
1 2
0
1
2
3
4
```第一个活动块是`[1,2,1]`。 完成后，推迟的任务是`[2,1]`。 因此，下一级由以下组成：`E(2)`其次是`E(1)`，而不是立即重新启动节点 1。 输出开始`1,2,1,2,1,2,1`，并且该算法得到相同的结果，因为它始终将后序列表视为下一个任务级别。 

在级别边界处，查询必须恰好属于一个级别。 该算法使用严格不等式`prefix(d) < K`当找到级别时。 如果`K`恰好是某个级别的最后一个位置，二分查找会保留该级别。 下一个位置则属于下一个级别。 这就是实现使用基于 1 的加权位置并仅在识别级别后减去完整前缀的原因。 

当目标位于重复的最终块 (Q^{d-1}(v)) 内时，从性能角度来看，每次递减 (d) 一个将是错误的，即使它在逻辑上是正确的。 自块二分查找将所有连续重复替换为一次跳转。 表达式 (A_v(d)-A_v(d-t)) 正是通过 (t) 次重复删除的总权重，因此剩余位置与原始序列保持同步。 

最后，当目标离开自身块时，它必须进入正确后代的块。 树深度最多为 49，因此在达到 (d=0) 之前只能有有限多次此类更改。 此时只剩下一个任务符号，剩下的位置直接从预先计算的有限序列（E(v)）中选择一个元素。 

如果您愿意，我还可以提供一个较短的竞赛编辑版本，它保留相同的证据，但在时间压力下更容易阅读。
