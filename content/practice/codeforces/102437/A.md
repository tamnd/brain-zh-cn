---
title: "CF 102437A - \u0411\u043b\u044d\u043a \\& \u0423\u0430\u0439\u0442"
description: "有 (n) 个城市围成一圈，中间有一个首都。 唯一可能的道路是连续外城之间的（n）条环形道路以及从首都到外城的（n）条辐条。 有些道路可能不存在。"
date: "2026-08-09T00:18:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102437
codeforces_index: "A"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102437
solve_time_s: 334
verified: true
draft: false
---

[CF 102437A - \u0411\u043b\u044d\u043a \\& \u0423\u0430\u0439\u0442](https://codeforces.com/problemset/problem/102437/A)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 个城市围成一圈，中间有一个首都。 唯一可能的道路是连续外城之间的（n）条环形道路以及从首都到外城的（n）条辐条。 有些道路可能不存在。 每一条现有的道路要么由白人控制，要么由黑人控制。 

我们需要根据该图包含多少条白方控制的道路来计算该图的生成树。 如果一棵树恰好有 (k) 条白色道路，则它会影响系数 (a_k)。 由于 (n+1) 个顶点上的生成树始终具有 (n) 条边，因此 (k) 的范围从 (0) 到 (n)。 

考虑输入的有用方法是将其视为两个循环数组。 字符串 (s) 描述圆形边缘，其中 (s_i) 是从城市 (i) 到城市 (i+1) 的边缘，(n+1) 解释为城市 (1)。 字符串 (t) 描述辐条，其中 (t_i) 是从首都到城市 (i) 的边缘。 一个角色`W`给出边缘权重 (x)，一个字符`B`赋予它权重 (1)，并且`-`赋予它权重 (0)。 

那么所需的答案就是生成树生成多项式的系数序列

 [
 F(x)=\sum_T x^{#W(T)}。 
]

 约束 (n\le 50000) 排除 (n) 中的任何二次项。 即使是 (O(n^2)) 动态程序也需要在上限处进行大约 (2.5\cdot 10^9) 次基本操作。 答案本身有 (n+1) 个系数，因此 (O(n\log^2 n)) 或类似的多项式时间方法是合适的。 模数 (998244353) 特别方便，因为它支持高效的 NTT 多项式乘法。 

在一些边界情况下，表面上正确的计数论证会失败。 例如，如果每个辐条都不存在```
3
WWW
---
```圆形城市形成一个环，但首都是孤立的，因此不存在生成树，答案是`0 0 0 0`。 在没有明确强制连接到首都的情况下计算外循环森林的方法会错误地计算它们。 

如果所有的路都是黑色的```
3
BBB
BBB
```图为 (K_4)，因此有 (16) 棵生成树，并且全部包含零个白色道路。 答案是`16 0 0 0`。 这是一个有用的检查，因为常数系数必须经受所有多项式操作。 

如果所有的道路都是白色的，```
3
WWW
WWW
```同一张图有 (16) 个生成树，但每棵树恰好包含三个白边。 答案是`0 0 0 16`。 这会捕获多​​项式次数被解释为黑边数量的错误。 

循环边界也很重要。 为了```
4
---W
BBBB
```唯一的环形道路是从城市 (4) 返回城市 (1) 的边缘。 一棵树由所有四个黑色辐条组成，另外两棵树使用白色圆形边缘并省略城市辐条 (1) 或城市辐条 (4)。 因此答案是`1 2 0 0 0`。 将圆形阵列视为路径会错过这两棵树。 

## 方法

 直接的暴力解决方案可以枚举现有道路的每个子集，检查它是否恰好包含 (n) 条边，然后测试这些边是否形成生成树。 最多有 (2n) 条可能的道路，因此枚举所有子集已经给出了 (2^{2n}=4^n) 种可能性。 检查每个子集的连通性又需要花费 (O(n))，在最简单的实现中需要 (O(n4^n)) 时间。 即使使用树恰好具有 (n) 条边的事实，也只能将其粗略地更改为

 [
 O\left(n\binom{2n}{n}\right),
 ]

 这仍然是指数级的。 暴力破解是正确的，因为每个生成树都是一个枚举的边子集，但它在很早之前就变得无用了（n=50000）。 

该图的结构为我们提供了对生成树更强有力的描述。 仅查看选定的圆形边缘。 它们要么形成路径的集合，要么形成整个圆。 如果至少缺少一条圆形边，则选定的圆形边会将外部顶点分割成多个路径组件。 每个这样的组件必须恰好包含一个选定的与首都的辐条。 如果它不包含辐条，该组件将与首都保持断开连接。 如果它包含两个或多个辐条，则这两个辐条及其端点之间的路径将创建一个循环。 

这一观察将图问题转换为局部序列问题。 当绕圈行走时，我们只需要记住当前外部组件是否已经收到了其独特的辐条。 这是一个两种状态的自动机。 

图的循环性质意味着我们不是从任意选择的起始状态运行这个自动机，而是乘以它的 (2\times2) 转换矩阵并获取它们的轨迹。 跟踪强制最后一个边沿之后的状态等于第一个边沿之前的状态，这正是序列回绕时所需要的。 

每个矩阵条目都是 (x) 中的多项式。 因此，我们必须乘以（n）个小矩阵，其条目是递增次数的多项式。 普通多项式乘法将再次变为二次，因此最终成分是 NTT 卷积。 分而治之的乘积树将 (O(\log n)) 级别中的矩阵相乘，而每个级别执行的多项式乘法总量以 (O(n\log n)) 为界。 完整的复杂度是 (O(n\log^2 n))。 

矩阵乘积本身可以使用 Strassen (2\times2) 公式而不是通常的八次多项式乘法来执行七次多项式乘法。 这只是一种实现优化，但对于 Python 实现来说很重要，因为多项式卷积主导了运行时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n4^n)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O(n\log^2 n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 将每条现有道路视为多项式权重。 白色道路获得权重 (x)，黑色道路获得权重 (1)，不存在的道路获得权重 (0)。 所选边集的权重的乘积正好是 (x^k)，其中 (k) 是其白边的数量。 
2. 对于每个外城 (i)，令 (q_i) 为其辐条的权重，令 (r_i) 为从 (i) 到 (i+1) 的圆形边缘的权重。 

在处理城市 (i) 时，保持状态 (0) 或 (1)。 状态（0）表示当前圆形组件还没有选择辐条，而状态（1）表示它已经有了自己唯一的辐条。 
3.首先考虑圆形边缘(i)不存在的情况。 当前组件以城市 (i) 结束，因此它必须恰好包含一个辐条。 从状态（0），我们必须选择辐条，贡献（q_i），并移动到下一个组件的状态（0）。 从状态 (1) 开始，我们不能选择另一个辐条，贡献 (1)，然后再次移动到状态 (0)。 

其转移矩阵为

[
 A_i=
 \开始{p矩阵}
 q_i&0\
 1&0
 \end{pmatrix}。 
]
 4. 现在考虑选择圆形边 (i) 的情况。 它贡献了(r_i)。 如果当前组件具有状态（0），我们可以忽略辐条并保持状态（0），或者选择辐条并移动到状态（1）。 如果组件已经具有状态 (1)，我们无法选择另一个辐条，因此它保持在状态 (1)。 

乘以边权重之前的转移矩阵为

 [
 B_i=
 \开始{p矩阵}
 1&q_i\
 0&1
 \end{pmatrix}。 
]

 包括圆形边缘权重得出 (r_iB_i)。 
5. 我们可以选择圆形边缘的任一状态，因此完整的转移矩阵为

 \开始{p矩阵}
 q_i+r_i&q_ir_i\
 1&r_i
 \end{pmatrix}。 
]

 每个有效的本地选择在此矩阵中仅表示一次。 
6. 将所有矩阵按循环顺序相乘：

 [
 P=M_1M_2\cdots M_n。 
]

 采用 (\operatorname{tr}(P)) 会强制自动机以与开始时相同的状态完成。 如果至少缺少一个圆形边缘，则恰好给出了每个圆形组件包含一个辐条的条件。 
7. 跟踪计数了一种特殊配置，但它不是生成树。 如果选择每条圆形边，则外部顶点将形成一个完整的循环。 自动机有两种可能的循环状态，到处都是状态 (0) 和到处都是状态 (1)，并且两者都产生等于

 [
 \prod_i r_i。 
]

 在这两种配置中均未选择辐条，因此首都已断开连接。 因此我们必须减去

 [
 2\prod_i r_i。 
]

 如果不存在任何圆形边缘，则该乘积为零并且无需减去任何内容。 
8. 生成的多项式最多有 (n) 次，因为每个生成树正好有 (n) 条边。 在多项式乘法过程中，我们可以丢弃次数 (n) 以上的系数，因为它们永远不会影响最终答案。 
9. 按顺序将 (n) 个多项式矩阵相乘仍会产生 (O(n^2)) 工作。 相反，构建一个平衡的分而治之的产品树。 矩阵的一段由其乘积表示，两个相邻的段乘积在递归调用返回时相乘。 
10. 多项式乘法由 NTT 在 (998244353) 下执行。 对于非常小的多项式，普通 (O(ab)) 乘法比构造 NTT 数组更快，因此该实现使用小的朴素乘法阈值。 
11. 最后，求完整矩阵的迹，减去特殊的全圆边缘贡献，并打印系数 (0) 到 (n)。 

该结构背后的不变性是，每当处理圆形边缘时，矩阵状态都会准确记录当前打开的圆形组件是否已包含其一个允许的辐条。 仅当该组件恰好具有一个辐条时，才允许通过不存在的圆形边缘进行过渡，而选定的圆形边缘仅延伸该组件而不允许有第二个辐条。 因此，跟踪计数的每个循环状态序列对应于每个组件只有一个辐条的圆形路径的集合。 这样的集合正好有 (n) 条边并且是相连的，因此是生成树。 该对应关系之外的唯一迹线配置是选择每个圆形边缘时的两个零辐条状态，并且这些状态被显式删除。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
ROOT = 3
NAIVE_LIMIT = 32

LIMIT = 0
root_cache = {}
inv_root_cache = {}

def cut(p):
    if len(p) > LIMIT + 1:
        p = p[:LIMIT + 1]
    while len(p) > 1 and p[-1] == 0:
        p.pop()
    return p

def padd(a, b):
    n = max(len(a), len(b))
    c = [0] * n
    la = len(a)
    lb = len(b)
    for i in range(n):
        x = a[i] if i < la else 0
        y = b[i] if i < lb else 0
        z = x + y
        if z >= MOD:
            z -= MOD
        c[i] = z
    return cut(c)

def psub(a, b):
    n = max(len(a), len(b))
    c = [0] * n
    la = len(a)
    lb = len(b)
    for i in range(n):
        x = a[i] if i < la else 0
        y = b[i] if i < lb else 0
        z = x - y
        if z < 0:
            z += MOD
        c[i] = z
    return cut(c)

def lincomb(items):
    n = 1
    for p, _ in items:
        if len(p) > n:
            n = len(p)

    c = [0] * n
    for p, sign in items:
        if sign == 1:
            for i, x in enumerate(p):
                c[i] += x
        else:
            for i, x in enumerate(p):
                c[i] -= x

    for i in range(n):
        c[i] %= MOD

    return cut(c)

def ntt(a, invert):
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        if invert:
            wlen = inv_root_cache.get(length)
            if wlen is None:
                wlen = pow(ROOT, (MOD - 1) // length, MOD)
                wlen = pow(wlen, MOD - 2, MOD)
                inv_root_cache[length] = wlen
        else:
            wlen = root_cache.get(length)
            if wlen is None:
                wlen = pow(ROOT, (MOD - 1) // length, MOD)
                root_cache[length] = wlen

        half = length >> 1

        for start in range(0, n, length):
            w = 1
            end = start + half
            j = start
            while j < end:
                u = a[j]
                v = a[j + half] * w % MOD

                x = u + v
                if x >= MOD:
                    x -= MOD

                y = u - v
                if y < 0:
                    y += MOD

                a[j] = x
                a[j + half] = y
                w = w * wlen % MOD
                j += 1

        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    if not a or not b:
        return [0]

    if a == [0] or b == [0]:
        return [0]

    la = len(a)
    lb = len(b)

    if min(la, lb) <= NAIVE_LIMIT or la * lb <= 4096:
        res = [0] * (min(la + lb - 1, LIMIT + 1))

        for i, x in enumerate(a):
            if x == 0:
                continue
            max_j = min(lb, LIMIT + 1 - i)
            for j in range(max_j):
                res[i + j] = (res[i + j] + x * b[j]) % MOD

        return cut(res)

    need = min(la + lb - 1, LIMIT + 1)

    size = 1
    while size < la + lb - 1:
        size <<= 1

    fa = a + [0] * (size - la)
    fb = b + [0] * (size - lb)

    ntt(fa, False)
    ntt(fb, False)

    for i in range(size):
        fa[i] = fa[i] * fb[i] % MOD

    ntt(fa, True)

    return cut(fa[:need])

def matrix_add(a, b):
    return (
        padd(a[0], b[0]),
        padd(a[1], b[1]),
        padd(a[2], b[2]),
        padd(a[3], b[3]),
    )

def matrix_product(a, b):
    """
    a = [[a0, a1],
         [a2, a3]]

    b = [[b0, b1],
         [b2, b3]]

    Polynomial Strassen multiplication.
    """

    a0, a1, a2, a3 = a
    b0, b1, b2, b3 = b

    p1 = convolution(padd(a0, a3), padd(b0, b3))
    p2 = convolution(padd(a2, a3), b0)
    p3 = convolution(a0, psub(b1, b3))
    p4 = convolution(a3, psub(b2, b0))
    p5 = convolution(padd(a0, a1), b3)
    p6 = convolution(psub(a2, a0), padd(b0, b1))
    p7 = convolution(psub(a1, a3), padd(b2, b3))

    c0 = lincomb([
        (p1, 1),
        (p4, 1),
        (p5, -1),
        (p7, 1),
    ])

    c1 = lincomb([
        (p3, 1),
        (p5, 1),
    ])

    c2 = lincomb([
        (p2, 1),
        (p4, 1),
    ])

    c3 = lincomb([
        (p1, 1),
        (p3, 1),
        (p2, -1),
        (p6, 1),
    ])

    return c0, c1, c2, c3

def make_poly(v):
    if v == 0:
        return [0]
    if v == 1:
        return [1]
    return [0, 1]

def build_product(s, t, left, right):
    if right - left == 1:
        q = make_poly(1 if t[left] == 'B' else 0 if t[left] == '-' else 2)
        r = make_poly(1 if s[left] == 'B' else 0 if s[left] == '-' else 2)

        # The encoding above used 2 for W temporarily.
        # Replace it by the polynomial x.
        if t[left] == 'W':
            q = [0, 1]
        if s[left] == 'W':
            r = [0, 1]

        qr = convolution(q, r)
        qr = cut(qr)

        return (
            padd(q, r),
            qr,
            [1],
            r,
        )

    mid = (left + right) >> 1

    a = build_product(s, t, left, mid)
    b = build_product(s, t, mid, right)

    return matrix_product(a, b)

def solve_case(n, s, t):
    global LIMIT
    LIMIT = n

    # M_i =
    #
    # [ q_i + r_i, q_i r_i ]
    # [     1,       r_i   ]

    product = build_product(s, t, 0, n)

    answer = product[0][:]
    if len(product[3]) > len(answer):
        answer += [0] * (len(product[3]) - len(answer))

    for i, x in enumerate(product[3]):
        answer[i] = (answer[i] + x) % MOD

    # The trace is product[0] + product[3].
    # If every circular edge is present, it contains two
    # invalid zero-spoke cyclic states.
    if '-' not in s:
        white_rim = s.count('W')
        if white_rim >= len(answer):
            answer += [0] * (white_rim + 1 - len(answer))
        answer[white_rim] = (answer[white_rim] - 2) % MOD

    if len(answer) < n + 1:
        answer += [0] * (n + 1 - len(answer))

    answer = answer[:n + 1]

    return ' '.join(map(str, answer))

def main():
    n = int(input())
    s = input().strip()
    t = input().strip()
    print(solve_case(n, s, t))

if __name__ == "__main__":
    main()
```该实现通过行主序的四个多项式的元组表示 (2\times2) 多项式矩阵。 在一片叶子上，`q`是辐条重量，`r`是圆边权重，所以矩阵正好是

 [
 \开始{p矩阵}
 q+r&qr\
 1&r
 \end{pmatrix}。 
]

 中的小转换`build_product`故意将缺失的边缘保留为零多项式，将黑色边缘保留为常数多项式 (1)，将白色边缘保留为 (x)。 

递归函数`build_product`保留原来的循环顺序。 它首先计算左半部分和右半部分的乘积，然后将这两个矩阵相乘。 不执行矩阵交换，这是必要的，因为矩阵乘法本身是不可交换的。 

多项式运算始终以 (n) 次截断。 这是安全的，因为每个所需的生成树项都恰好具有 (n) 个边，因此较高阶的系数永远不会影响所请求的答案。 

矩阵乘法使用七乘斯特特拉森恒等式。 对于多项式，该恒等式中的每个标量乘法都被卷积替换。 这将每个矩阵合并的 8 个 NTT 卷积减少到 7 个。 

这`convolution`对于小输入，功能切换到普通乘法。 这很重要，因为 NTT 具有相对较大的常数因子，而几十个系数的多项式直接相乘的成本更低。 

(2\prod r_i) 的减法无需另一个多项式乘法即可实现。 由于每个 (r_i) 要么是 (0)、(1) 要么 (x)，因此如果不存在任何圆形边缘，它们的乘积为零。 否则它只是 (x^c)，其中 (c) 是白色圆形边的数量。 

Python 整数不会溢出，因此不存在单独的溢出问题。 输入多项式的每个算术结果都会以模 (998244353) 进行约减。 NTT 长度永远不会接近模数限制，因为所需的最大变换远低于支持的 2 的幂。 

## 工作示例

 ### 示例 1

 输入是```
3
---
WBW
```每个圆形边缘都不存在，因此 (r_i=0)。 辐条权重为 (q_1=x)、(q_2=1) 和 (q_3=x)。 

各个转移矩阵是

 [
 M_1=
 \开始{p矩阵}
 x&0\
 1&0
 \end{pmatrix},
 \四边形
 M_2=
 \开始{p矩阵}
 1&0\
 1&0
 \end{pmatrix},
 \四边形
 M_3=
 \开始{p矩阵}
 x&0\
 1&0
 \end{pmatrix}。 
]

 产品状态演变如下。 

| 步骤| 矩阵乘积 | 追踪 |
 | --- | --- | --- |
 | 开始| (M_1) | (x)|
 | 城市2之后| (M_1M_2) | (x)|
 | 城市3之后| (M_1M_2M_3) | (x^2) | (x^2) |

 没有圆形边缘，因此异常的全圆形边缘校正为零。 最终的多项式是 (x^2)，给出```
0 0 1 0
```这表明多项式指数直接计算白边。 唯一可能的生成树由所有三个辐条组成，其中两个是白色的。 

### 示例 2

 输入是```
3
WWW
BBB
```每个圆形边都有权重 (x)，而每个辐条都有权重 (1)。 因此，所有三个转移矩阵都是

 [
 中号=
 \开始{p矩阵}
 1+x&x\
 1&x
 \end{pmatrix}。 
]

 后续产品有

 | 步骤| 多项式矩阵 |
 | --- | --- |
 | (男)| (\begin{pmatrix}1+x&x\1&x\end{pmatrix}) |
 | (M^2) | (M^2) | (\begin{pmatrix}1+3x+x^2&x+2x^2\1+2x&x+x^2\end{pmatrix}) |
 | (M^3) | (M^3) | (\begin{pmatrix}1+4x+5x^2+x^3&x+3x^2+2x^3\1+3x&x+3x^2+x^3\end{pmatrix}) |

 踪迹是

 [
 1+6x+9x^2+2x^3。 
]

 所有圆形边缘都存在，因此两个无效的零辐条状态贡献 (2x^3)。 删除它们可以得到

 [
 1+6x+9x^2。 
]

 因此答案是```
1 6 9 0
```修正是这个例子的关键部分。 如果没有它，(x^3) 的系数将错误地为 (2)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log^2 n)) | 分而治之矩阵乘积有 (O(\log n)) 个级别，每个级别执行总共 (O(n\log n)) 数量的 NTT 卷积工作 |
 | 空间| (O(n)) | (O(n)) | 每个递归乘积存储 (O(n)) 个多项式系数，最大的 NTT 缓冲区也是 (O(n)) |

 最大的实例有 (50000) 个外城，因此二次算法已经需要数十亿次运算。 除了对数因子之外，乘积树方法将多项式工作降低到接近线性的复杂度。 模数 (998244353) 允许使用 NTT 精确执行所有所需的卷积。 

## 测试用例

 以下测试工具使用相同的`solve_case`作为提交的解决方案。 最大尺寸测试使用未加权轮的已知生成树总数。 对于具有 (n) 个外部顶点的轮子，该总数为 (L_{2n}-2)，其中 (L_0=2)、(L_1=1) 和 (L_i=L_{i-1}+L_{i-2})。```python
# helper: run solution on input string, return output string
import io
import sys

def run(inp: str) -> str:
    data = inp.strip().splitlines()
    n = int(data[0])
    s = data[1].strip()
    t = data[2].strip()
    return solve_case(n, s, t)

# Provided samples
assert run("""3
---
WBW
""") == "0 0 1 0", "sample 1"

assert run("""3
WWW
BBB
""") == "1 6 9 0", "sample 2"

assert run("""5
BWB-B
WB-W-
""") == "0 2 6 3 0 0", "sample 3"

# Minimum-size graph, all roads Black.
assert run("""3
BBB
BBB
""") == "16 0 0 0", "all black, K4"

# Minimum-size graph, all roads White.
assert run("""3
WWW
WWW
""") == "0 0 0 16", "all white, K4"

# No spokes, so the capital is isolated.
assert run("""3
WWW
---
""") == "0 0 0 0", "isolated capital"

# Only the wrap-around circular edge exists and is White.
assert run("""4
---W
BBBB
""") == "1 2 0 0 0", "wrap-around edge"

# Maximum-size all-Black instance.
n = 50000
s = "B" * n
t = "B" * n

lucas0, lucas1 = 2, 1
for _ in range(2 * n):
    lucas0, lucas1 = lucas1, (lucas0 + lucas1) % MOD

total = (lucas1 - 2) % MOD
expected = " ".join([str(total)] + ["0"] * n)

assert run(f"{n}\n{s}\n{t}\n") == expected, "maximum-size all black"

# Maximum-size all-White instance.
s = "W" * n
t = "W" * n
expected = " ".join(["0"] * n + [str(total)])

assert run(f"{n}\n{s}\n{t}\n") == expected, "maximum-size all white"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 / BBB / BBB`|`16 0 0 0`| 最小尺寸和全黑配重 |
 |`3 / WWW / WWW`|`0 0 0 16`| 全白加权和最高程度|
 |`3 / WWW / ---`|`0 0 0 0`| 资本脱节 |
 |`4 / ---W / BBBB`|`1 2 0 0 0`| 圆形环绕边缘和边界索引 |
 | (n=50000)，全部`B`| (L_{100000}-2) 系数为零 | 最大尺寸输入和 NTT 路径 |
 | (n=50000)，全部`W`| (L_{100000}-2) 系数 (50000) | 最大程度和全白边界|

 ## 边缘情况

 当大写字母没有关联边时，算法会自动给出零。 每个过渡都有 (q_i=0)，因此圆形组件永远无法与选定的辐条闭合。 如果圆形图仍然存在，则迹线可能描述圆形配置，但所需的每个组件一辐条件消除了它们。 为了`3 / WWW / ---`，每个系数都为零。 

当每条道路都是黑色时，每条道路的权重都是 (1)。 对于 (n=3)，图为 (K_4)，并且转换乘积产生完整的生成树计数。 校正减去两个无效的全圆边缘状态，使 (16) 处于零度。 因此答案是`16 0 0 0`。 

当每条道路都是白色时，每条选定的边都会贡献一个 (x) 因子。 每个生成树都恰好有 (n) 条边，因此所有有效项都必须具有 (n) 度。 对于 (n=3)，多项式为 (16x^3)，产生`0 0 0 16`。 这也是一个有用的检查，即截断高于 (n) 的度数无法删除有效答案。 

如果缺少一个圆形边缘，则异常校正就会消失，因为 (\prod_i r_i=0)。 例如，与```
4
---W
BBBB
```唯一的圆形边缘是环绕边缘 (4\leftrightarrow1)。 全辐条树贡献一项零度项。 选择白色圆形边缘会在城市 (4) 和 (1) 之间创建一条路径，因此必须删除它们的两个辐条之一。 有两棵这样的树，都有一条白边。 结果是`1 2 0 0 0`。 

所有圆形边都存在的情况是微妙的循环边界情况。 该跟踪具有两种人工配置，因为自动机可以永远保持在状态 (0) 或永远保持在状态 (1)，而无需关闭组件。 两者都对应于选择每个圆形边缘并且没有辐条。 它们不是生成树，因为首都是孤立的，因此需要精确减去 (2\prod_i r_i)。 减法还可以正确处理混合的黑白圆形边缘，因为该乘积带有适当的 (x) 幂。 

最后，缺失的边必须由零多项式表示，而不是简单地跳过。 它们的存在改变了连接结构，而不仅仅是所选边的权重。 转换矩阵通过使选择不存在道路的每个转换贡献为零来合并这一点，同时仍然允许自动机在省略该道路时关闭当前组件。
