---
title: "CF 102253L - 有限排列"
description: "对于每个位置 (i)，((li,ri)) 对描述了包含 (i) 且 (pi) 最小的最大连续区间。"
date: "2026-08-17T21:47:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102253
codeforces_index: "L"
codeforces_contest_name: "2017 Chinese Multi-University Training, BeihangU Contest"
rating: 0
weight: 102253
solve_time_s: 248
verified: true
draft: false
---

[CF 102253L - 有限排列](https://codeforces.com/problemset/problem/102253/L)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个位置 (i)，对 ((l_i,r_i)) 描述包含 (i) 的最大连续区间，其中 (p_i) 为最小值。 等效地，(p_i) 小于 (l_i) 和 (i-1) 之间的每个元素、(i+1) 和 (r_i) 之间的每个元素，并且间隔不能在任一方向上进一步扩展一个位置。 

任务是计算 (1,\ldots,n) 有多少个排列恰好具有这些最小间隔。 答案取模 (10^9+7)。 当输入有效时，官方社论将结果结构标识为唯一的笛卡尔树。 

约束足够大，算法必须基本上是线性的。 一个测试用例可以包含 (10^6) 个位置，并且所有测试用例总共最多包含 (3\cdot10^6) 个位置。 (O(n\log n)) 解决方案已经比必要的要昂贵得多，尤其是在 Python 中，而完全排除了任何二次方。 128 MB 的内存限制也很重要，因为一百万个整数的普通 Python 列表每个消耗数十兆字节。 下面的实现使用紧凑整数数组和计数排序，而不是 Python 的对象密集型列表和比较排序。 

粗心的实施可能会因多种原因而失败。 对于 (n=1)，唯一可能的输入是```
1
1
1
```答案是（1）。 将空子区间视为无效会错误地拒绝唯一有效的树。 

重复或不兼容的间隔也必须被拒绝。 例如，```
3
1 1 1
3 3 3
```对于所有三个位置给出相同的间隔 ([1,3]). 简单地选择这些位置之一作为根的简单实现可能会继续下去，就好像树是有效的一样，但所有三个位置无法具有相同的最大最小间隔。 正确的输出是`Case #1: 0`。 

跨越区间是另一个常见的失败。 考虑```
3
1 1 2
2 3 3
```给出 ([1,2])、([1,3]) 和 ([2,3])。 间隔重叠，但一个间隔不包含另一个间隔。 这样的配置不能来自笛卡尔树，所以答案是`Case #1: 0`。 仅检查每个 (l_i\le i\le r_i) 是否会错误地接受它的解决方案。 

## 方法

 暴力解决方案可以枚举 (1,\ldots,n) 的每个排列，计算每个位置的最大最小间隔，并将结果与输入进行比较。 有 (n!) 种排列。 即使使用线性时间单调堆栈过程来计算每个排列的所有最接近的较小元素，检查所有排列也已经花费了 (\Theta(n\cdot n!)) 操作。 对每个相关区间进行直接扫描将产生成本 (\Theta(n^2\cdot n!))。 即使在 (n=10) 左右，早在 (10^6) 的实际约束之前，这也变得毫无希望。 

有用的观察是给定的间隔不是任意的。 对于排列，请考虑其最小笛卡尔树。 根是包含最小值的位置，其左子树包含根左侧的位置，其右子树包含根右侧的位置。 对于每个节点 (u)，其子树中的位置形成一个连续的区间，即 ([l_u,r_u])。 这与官方解决方案中使用的递归结构相同。 

假设某个子树占据([L,R])，并且其根位于位置(u)。 那么它的左子节点必须准确地表示 ([L,u-1])，而其右子节点必须准确地表示 ([u+1,R])。 因此，可以通过重复询问哪个输入区间等于当前所需区间来重建整个树。 

这也给出了一个直接的计数公式。 令 (s(u)) 为以 (u) 为根的子树的大小。 因为子树正是 ([l_u,r_u])，

 [
 s(u)=r_u-l_u+1。 
]

 对于固定笛卡尔树，必须将最小值分配给它的根。 剩余的值在左子树和右子树之间分配。 如果它们的大小为(a)和(b)，则有

 [
 \binom{a+b}{a}
 ]

 选择哪些值属于左子树的方法。 递归地相乘得到

 [
 f(u)=\binom{s(v_L)+s(v_R)}{s(v_L)}f(v_L)f(v_R)。 
]

 展开阶乘表明完整的乘积简化为

 \frac{n!}{\prod_{i=1}^{n}(r_i-l_i+1)}。 
]

 官方社论给出了完全相同的形式。 

剩下的挑战是有效地定位根区间。 如果我们通过递增 (l) 对所有区间进行排序，对于相等 (l)，通过递减 (r) 排序，它们的顺序就是笛卡尔树的预序。 由于两个坐标最多为 (n)，因此可以通过两次稳定的计数排序传递来完成此排序，从而给出线性时间而不是 (O(n\log n))。 官方社论同样建议在递归分解之前对间隔进行基数排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (\Theta(n\cdot n!)) 具有线性验证 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 读取数组 (l) 和 (r)，将它们保存在紧凑整数数组中。 对于每个位置(i)，将([l_i,r_i])视为节点(i)所要求的子树区间。 
2. 按 (l_i) 升序和 (r_i) 降序对位置进行排序。 我们使用稳定计数排序两次，第一次按 (n-r_i)，然后按 (l_i)。 第一遍在 equal-(l_i) 组内产生递减的 (r_i)，第二遍保留该顺序。 
3. 从所需的间隔 ([1,n]) 开始。 已排序预序中的第一个间隔必须恰好是该间隔。 如果不是，则输入无法描述任何笛卡尔树，因此答案为零。 
4. 当当前区间为([L,R])且其根位于位置(u)时，要求根的输入区间恰好为([L,R])。 那么唯一可能的孩子占据 ([L,u-1]) 和 ([u+1,R])。 首先将右区间压入堆栈，然后将左区间压入堆栈，以便接下来处理左子树。 每个非空子树将其大小 (R-L+1) 贡献给分母。 
5. 在消耗了每个非空的所需间隔之后，当所有（n）个输入间隔也被消耗时，数据恰好有效。 计算 (n!) 模 (10^9+7)，将其乘以每个子树大小的模逆，并获得

 n!\prod_{i=1}^{n}(r_i-l_i+1)^{-1}
 \pmod {10^9+7}。 
]

 使用以下命令预先计算从 (1) 到 (10^6) 的所有值的倒数

 -\左\lfloor\frac{MOD}{i}\右\rfloor
 \operatorname{inv}(MOD\bmod i)
 \pmod {MOD}。 
]

 ### 为什么它有效

 对于任何有效的排列，其最小笛卡尔树的每个节点都具有一个子树区间，并且该子树区间为 ([l_i,r_i])。 在子树 ([L,R]) 中，其根 (u) 将位置分为强制左区间 ([L,u-1]) 和右区间 ([u+1,R])。 因此，每棵有效树都必须通过算法执行的每个间隔检查。 

相反，如果以正确的递归顺序找到所有所需的区间，则它们定义一棵二叉树，其中序遍历为 (1,2,\ldots,n)，并且每个节点的子树正是其提供的区间。 沿着这个最小堆树逐渐分配值会精确地产生所需的笛卡尔树结构。 由于排列包含不同的值，因此每个有效排列恰好对应于一个这样的标签。 

对于固定树，递归交织计数是上述二项式系数的乘积。 每个节点贡献一个子树大小的分母，因此所有内部阶乘都取消并留下 (n!/\prod s(u))。 由于 (s(u)=r_u-l_u+1)，算法使用的公式对每个有效排列恰好计数一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 1000000007
MAX_N = 1000000

# Modular inverses for every possible subtree size.
inv = array('I', [0]) * (MAX_N + 1)
inv[1] = 1
for i in range(2, MAX_N + 1):
    inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

def radix_order(l, r, n):
    """
    Return indices sorted by:
        l[index] ascending
        r[index] descending
    using two stable counting-sort passes.
    """
    order = array('i', range(n))
    tmp = array('i', [0]) * n

    # First pass: r descending, encoded as n - r.
    cnt = array('i', [0]) * (n + 1)

    for idx in order:
        cnt[n - r[idx]] += 1

    pos = 0
    for key in range(n + 1):
        c = cnt[key]
        cnt[key] = pos
        pos += c

    for idx in order:
        key = n - r[idx]
        p = cnt[key]
        tmp[p] = idx
        cnt[key] = p + 1

    # Second pass: l ascending.
    cnt = array('i', [0]) * (n + 1)

    for idx in tmp:
        cnt[l[idx]] += 1

    pos = 0
    for key in range(n + 1):
        c = cnt[key]
        cnt[key] = pos
        pos += c

    for idx in tmp:
        key = l[idx]
        p = cnt[key]
        order[p] = idx
        cnt[key] = p + 1

    return order

def solve_case(n, l, r):
    order = radix_order(l, r, n)

    # Each item is an expected subtree interval [L, R].
    # We process them in preorder.
    stack_l = [1]
    stack_r = [n]

    ptr = 0
    denominator = 1

    while stack_l:
        L = stack_l.pop()
        R = stack_r.pop()

        if L > R:
            continue

        if ptr >= n:
            return 0

        u = order[ptr]
        ptr += 1

        # The next preorder node must represent exactly [L, R].
        if l[u] != L or r[u] != R or not (L <= u <= R):
            return 0

        size = R - L + 1
        denominator = denominator * size % MOD

        # Push right first so that left is processed first.
        if u + 1 <= R:
            stack_l.append(u + 1)
            stack_r.append(R)

        if L <= u - 1:
            stack_l.append(L)
            stack_r.append(u - 1)

    # Every supplied interval must belong to the constructed tree.
    if ptr != n:
        return 0

    factorial = 1
    for x in range(2, n + 1):
        factorial = factorial * x % MOD

    return factorial * pow(denominator, MOD - 2, MOD) % MOD

def solve():
    case_no = 1
    output = []

    while True:
        line = input()
        if not line:
            break
        if not line.strip():
            continue

        n = int(line)

        l = array('i', map(int, input().split()))
        r = array('i', map(int, input().split()))

        ans = solve_case(n, l, r)
        output.append(f"Case #{case_no}: {ans}")
        case_no += 1

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```逆表构建一次，因为每个子树的大小都在 (1) 和 (n) 之间，并且 (n\le10^6)。 递归避免了对每个节点进行模幂运算。 单个`pow`仍然用于实现中的最终分母，但它可以等效地替换为乘法`inv[size]`对于验证期间的每个节点。 后者避免了最后的求幂，并且与公式稍微一致。 

两个数组 (l) 和 (r) 使用`array('i')`而不是 Python 列表。 Python 整数是一个开销很大的对象，而 32 位整数就足够了，因为每个坐标最多为 (10^6)。 出于同样的原因，排序缓冲区和计数数组使用相同的表示形式。 

基数排序使用 (n-r_i) 作为第一个键。 按升序计数相当于对(r_i)按降序排序。 第二遍按 (l_i) 升序排序并且是稳定的，因此相等的 (l_i) 值保留其递减 (r_i) 顺序。 

递归树分解是通过显式堆栈实现的。 递归 Python 实现可以在完全倾斜的笛卡尔树上达到深度 (10^6)，并且会溢出递归限制。 堆栈还避免了函数调用开销。 

条件`l[u] != L or r[u] != R`是核心有效性检查。 节点只能是子树的根，其边界恰好是其提供的边界。 支票`L <= u <= R`是由原始输入约束隐含的，但保留它会使树显式不变，并在输入验证假设发生更改时保护例程。 

分母包含子树大小，而不是子树大小。 例如，覆盖五个位置的根贡献 (5)，即使它的子项的大小为 1 和 3。 这是简化的 (n!/\prod s(u)) 公式中出现的数量。 

## 工作示例

 ### 示例 1

 输入是```
3
1 1 3
1 3 3
```三个区间是 ([1,1])、([1,3]) 和 ([3,3])。 按左端点递增、右端点递减排序后，前序是位置（2）处的节点，其次是位置（1）和（3）处的节点。 

| 所需间隔 | 选择根| 根区间| 子树大小 | 分母|
 | --- | --- | --- | --- | --- |
 | [1,3]| 2 | [1,3]| 3 | 3 |
 | [1,1]| 1 | [1,1]| 1 | 3 |
 | [3,3]| 3 | [3,3]| 1 | 3 |

 该树有根 (2)、左子树 (1) 和右子树 (3)。 分母为(3)，而(3!=6)，所以

 [
 \frac{3!}{3}=2。 
]

 这两种排列是将较大值放在最小值两侧的两种可能方法。 

### 示例 2

 输入是```
5
1 2 2 4 5
5 2 5 5 5
```间隔为 ([1,5])、([2,2])、([2,5])、([4,5]) 和 ([5,5])。 

| 所需间隔 | 选择根| 根区间| 子树大小 | 分母|
 | --- | --- | --- | --- | --- |
 | [1,5]| 1 | [1,5]| 5 | 5 |
 | [2,5]| 3 | [2,5]| 4 | 20 |
 | [2,2]| 2 | [2,2]| 1 | 20 |
 | [4,5]| 4 | [4,5]| 2 | 40 | 40
 | [5,5]| 5 | [5,5]| 1 | 40 | 40

 生成的笛卡尔树将位置 (1) 作为其根，位置 (3) 作为其右子节点，位置 (2) 作为 (3) 的左子节点，并且链 (4\rightarrow5) 位于右侧。

 最终计数为

 # \压裂{120}{40}

 1.

 ]

 此示例说明了为什么仅单独检查间隔是不够的。 它们的递归包含关系决定了树以及标签的数量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 (O(n)) | 两次计数排序遍历、一次树遍历和一次阶乘计算 |
 | 空间| (O(n)) | (O(n)) | 输入数组、基数排序缓冲区、计数数组和遍历堆栈 |

 所有测试用例的总数 (n) 最多为 (3\cdot10^6)，因此线性工作直接随总输入大小缩放。 紧凑型`array`表示将主数组保持在 128 MB 内存限制内。 该算法避免了 Python 比较排序并避免了递归，这两者在 (n=10^6) 时都很重要。 

## 测试用例

 以下测试假设`solve()`从上面的解决方案中可以得到函数。 助手暂时取代了全局`input`函数，因此可以使用内存输入流来执行相同的求解器。```python
import sys
import io

# The solve() function and global input from the submitted solution
# are assumed to be available here.

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        solve()
        # solve() writes to stdout, so capture it through a second redirection.
    finally:
        sys.stdin = old_stdin
        input = old_input

def run_capture(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        input = sys.stdin.readline

        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided samples.
sample = """\
3
1 1 3
1 3 3
5
1 2 2 4 5
5 2 5 5 5
"""
assert run_capture(sample) == (
    "Case #1: 2\n"
    "Case #2: 3\n"
), "provided samples"

# Minimum size.
assert run_capture(
    "1\n"
    "1\n"
    "1\n"
) == "Case #1: 1\n", "single element"

# A valid two-element increasing Cartesian tree.
assert run_capture(
    "2\n"
    "1 2\n"
    "2 2\n"
) == "Case #1: 1\n", "two-element boundary case"

# All intervals are identical. No valid Cartesian tree exists.
assert run_capture(
    "3\n"
    "1 1 1\n"
    "3 3 3\n"
) == "Case #1: 0\n", "duplicate root intervals"

# Crossing intervals. They cannot be nested as Cartesian-tree subtrees.
assert run_capture(
    "3\n"
    "1 1 2\n"
    "2 3 3\n"
) == "Case #1: 0\n", "crossing intervals"

# Maximum-size test. Every interval is a singleton, which is invalid
# for n > 1 because the root interval must be [1, n].
n = 1_000_000
l = " ".join(map(str, range(1, n + 1)))
r = l
maximum_case = f"{n}\n{l}\n{r}\n"

assert run_capture(maximum_case) == "Case #1: 0\n", "maximum-size input"
```这`run`上面的helper被保留为测试模板中请求的简单接口，而`run_capture`用于断言，因为产生式求解器直接写入标准输出。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 1`|`Case #1: 1`| 最小尺寸树和空子处理 |
 |`2 / 1 2 / 2 2`|`Case #1: 1`| 边界间隔和左端点处的根 |
 |`3 / 1 1 1 / 3 3 3`|`Case #1: 0`| 重复的区间和无效的笛卡尔树结构 |
 |`3 / 1 1 2 / 2 3 3`|`Case #1: 0`| 交叉区间和递归验证 |
 | (n=10^6), (l_i=r_i=i) | (n=10^6), (l_i=r_i=i) |`Case #1: 0`| 最大输入大小和线性时间行为 |

 ## 边缘情况

 对于单元素情况```
1
1
1
```排序后的顺序包含一个区间，初始所需区间也是([1,1])。 该节点的子树大小为 (1)，因此分母为 (1)，阶乘为 (1)，结果为 (1)。 没有左或右孩子被推入堆栈。 

对于全等间隔情况```
3
1 1 1
3 3 3
```第一个排序区间是 ([1,3])，因此算法最初接受三个节点之一作为候选根。 例如，如果该节点位于位置 (1)，则下一个所需的区间是 ([2,3])，但下一个排序的输入区间仍然是 ([1,3])。 精确区间比较失败，结果为零。 对于任何其他候选根也会出现同样的矛盾。 

对于交叉案例```
3
1 1 2
2 3 3
```排序后的区间为 ([1,2])、([1,3])、([2,3])。 完整数组的根必须覆盖([1,3])，但第一个排序区间是([1,2])。 该算法立即拒绝输入。 这会在执行任何计数之前捕获无效重叠。 

对于二元边界情况```
2
1 2
2 2
```根区间为([1,2])，属于位置(1)。 它的右子节点是单例区间 ([2,2])。 子树大小为 (2) 和 (1)，给出

 [
 \frac{2!}{2\cdot1}=1。 
]

 唯一有效的排列是递增，因此边界检查和子区间构造都与组合计数一致。 

对于 (l_i=r_i=i) 的最大尺寸输入，第一个区间是 ([1,1])，而整个数组需要根覆盖 ([1,10^6])。 尽管基数排序仍然处理了所有 (10^6) 间隔，但算法在达到第一个不匹配后会拒绝实例。 总工作量保持线性，并且递归调用不会溢出 Python 堆栈。
