---
title: "CF 102341D - 德登纳"
description: "我们需要为每个 (n) 个单词分配一个不同的非空二进制码字。 代码必须是无前缀的，因此码字形成二进制特里树的叶子。 还有一项附加限制：码字不能包含 00。"
date: "2026-08-14T01:26:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "D"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 393
verified: true
draft: false
---

[CF 102341D - 德登](https://codeforces.com/problemset/problem/102341/D)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要为每个 (n) 个单词分配一个不同的非空二进制码字。 代码必须是无前缀的，因此码字形成二进制特里树的叶子。 还有一个附加限制：码字可能永远不会包含`00`。 成本计入每个 trie 节点，包括空前缀。 如果恰好 (k) 个码字通过某个节点，则该节点的成本

 [
 f(k)=\sum_{j=1}^{k}\left\lfloor 1+\log_2 j\right\rfloor。 
]

 任务是选择特里结构的形状以使总成本最小。 

输入最多包含 (50,000) 个独立的 (n) 值，单个 (n) 可以大到 (10^{15})。 这立即排除了构造 trie，甚至 (O(n)) 动态程序也太大了。 二次 DP 是完全不可能的，而即使 (O(n\log n)) 也需要对 (10^{15}) 进行太多操作。 该解决方案必须利用以下事实：最佳 DP 函数的斜率变化数量非常少。 这是该问题的公认解决方案所使用的中心观察。 

有两个小案例暴露了常见的错误。 对于(n=2)，答案是(5)。 总是为左子树添加额外成本的粗心递归将得到（6），因为当左子树仅包含一个叶子时，码字可以在`0`。 额外的`1`后需要`0`仅当该子树至少有两个叶子时才需要。 

对于 (n=4)，答案是 (20)。 一种最佳形状对应于码字`0`,`10`,`110`， 和`111`。 根有四个后代，`0`树枝包含一片叶子，而`1`树枝包含三片叶子。 对称地处理两个根子节点忽略了子树进入的事实`0`不能立即分支，因为这样做会创建一个`00`边缘。 

对于 (n=10)，答案是 (98)。 这对于递归来说也是一个有用的边界情况，因为最佳分割并不是以明显的方式平衡的。 最佳分割由凸成本函数控制，而不是简单地通过选择两个大小相等的子树来控制。 官方样本证实了该值（98）。 

## 方法

 自然的暴力方法是将 (D(n)) 定义为包含 (n) 个叶子的有效 trie 的最小成本。 一旦根下面有 (n) 个叶子，它自己的成本就是 (f(n))。 如果左子树有(k)个叶子，右子树有(n-k)个叶子，则可以正常构建右子树。 通过到达左子树`0`，因此如果它包含多个叶子，则其下一条边必须是`1`在它可以分支之前。 该附加前缀贡献 (f(k))。 

特殊情况（k=1）不需要这样的额外节点，因为左子节点本身可以​​是叶子。 因此

 [
 D(1)=f(1)=1
 ]

 并且，对于 (n>1)，

 [
 D(n)=f(n)+
 \分钟\左(
 D(n-1)+1,,
 \min_{2\le k<n}
 {D(k)+D(n-k)+f(k)}
 \右）。 
]

 相同的递归式通常写为所有 (k) 的最小值，其中 (k=1) 项单独处理。 

如果我们直接计算 (D(1),D(2),\ldots,D(n))，每个状态都会尝试 (O(n)) 次分割，从而给出 (O(n^2)) 总工作量。 对于 (n=10^{15})，这大约是 (10^{30}) 次分割评估，因此这种方法不太可行。 

下一个观察结果是 (f) 是离散凸函数。 它从(k-1)到(k)的增量正好是(k)的比特长度，并且永远不会减少。 最优 DP 函数 (D) 也是离散凸函数。 因此，对于固定 (n)，表达式

 [
 D(k)+f(k)+D(n-k)
 ]

 作为 (k) 的函数是凸函数。 因此，可以通过整数三元搜索找到它的最小值，而不是扫描每个可能的分割。 这将一个新的 (D(n)) 计算的计算量减少到大约 (O(\log n)) 次评估。 凸公式和三元搜索是该问题的标准首次简化。 

这仍然不能解决实际的约束，因为计算直到 (10^{15}) 的每个值仍然是不可能的。 最终的观察结果更加不寻常：虽然 (D(n)) 在一个巨大的域上增长，但其离散斜率仅变化很少的次数。 直到 (10^{15}) 为止，只有大约 (1800) 次斜率变化。 第 1833 章（第 1833 章）

 因此，我们不是为每个 (n) 存储 (D(n))，而是存储每个线性段的起点、其斜率及其值。 在两个连续断点之间，

 [
 D(x)=D(p)+s(x-p)。 
]

 为了发现下一个断点，我们暂时扩展当前的线性段，并将该外推法与使用已知的分段线性函数评估的真实递归进行比较。 两者一致的最后一点是当前片段的结尾。 由于相等谓词单调变化，因此二分查找可以找到该点。 通过三元搜索最小化递归本身，给出预处理复杂度 (O(M\log^3 N))，其中 (M) 是斜率变化的数量。 每个查询只需要在断点之间进行二分搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DP | (O(N^2)) | (O(N)) | 太慢了|
 | 每个 (n) | 的凸 DP (O(N\log N)) | (O(N)) | 还是太慢|
 | 分段线性DP | (O(M\log^3 N+T\log M)) | (O(M)) | 已接受 |

 这里 (N=10^{15})、(T\le 50,000) 和 (M) 仅在所需范围的 (1833) 左右。 

## 算法演练

 1. 定义

 [
 f(k)=\sum_{j=1}^{k}\operatorname{bit_length}(j)。 
]

 我们需要重复 (f(k))，因此我们直接从最高设置位计算它，而不是对所有 (k) 项求和。 如果 (b=\operatorname{bit_length}(k))，则

 [
 f(k)=(b-2)2^{b-1}+1+b(k-2^{b-1}+1)。 
]

 这对 (f(k)) (O(1)) 进行一次评估。 
2. 将 (D(n)) 定义为具有 (n) 个码字的有效 trie 的最小成本。 基本情况是 (D(1)=1)。 

对于 (n>1)，在根处分割叶子。 如果`0`一侧有 (k) 个叶子，并且`1`边有(n-k)，根贡献(f(n))。 这`1`方贡献 (D(n-k))。 对于 (k>1)，`0`一方必须先采取强制措施`1`边，贡献 (f(k))，然后是最佳 (D(k)) 结构。 当 (k=1) 时，强制边缘是不必要的，因为`0`孩子已经是一片叶子了。 

因此

 [
 D(n)=f(n)+
 \分钟\左(
 D(n-1)+1,,
 \min_{2\le k<n}
 {D(k)+D(n-k)+f(k)}
 \右）。 
]
 3. 将 (D) 的当前已知部分存储为分段线性线段。 让`P[i]`是段 (i) 中的第一个 (x)，`S[i]`它的斜率，以及`V[i]`值 (D(P[i]))。 然后

 [
 D(x)=V[i]+S[i](x-P[i])
 ]

 每当 (P[i]\le x<P[i+1]) 时。 

最初 (P=[1])、(S=[4]) 和 (V=[1])。 第一段包含 (D(1)=1) 和 (D(2)=5)，其差为 (4)。 
4. 实现一个功能`known(x)`通过二分查找找到包含 (x) 的段并计算相应的线性表达式。 

故意允许此函数计算比当前已知断点大得多的值。 它代表最新发现的片段的线性外推。 
5. 实施`next_value(n)`使用递归式，将每个未知数 (D(k)) 替换为`known(k)`。 功能

 [
 D(k)+f(k)+D(n-k)
 ]

 在 (k) 中是凸的，因此整数三元搜索找到其最小值。 (k=1) 情况单独处理为`known(n - 1) + 1`。 
6. 假设当前线性段从 (p) 开始。 找到最大的 (x>p) ，其中

 [
 已知(x)=下一个值(x)。 
]

 只要外推线是实际的最优函数，两个值就一致。 在递归强制使用较大值的第一个点处，斜率发生变化。 相等条件在该搜索间隔内是单调的，因此二分搜索找到最后一个相等点。 
7. 添加发现的断点。 其值是从旧段获得的，新的斜率是

 [
 D(p+1)-D(p)。 
]

 我们从 (D(p+1)) 获得`next_value(p + 1)`。 重复此过程会生成直到 (10^{15}) 的所有斜率段。 
8.对于每个输入(n)，二分查找`P`找到它的线段并评估线性公式。 答案正是(D(n))。 

### 为什么它有效

 树递归考虑了树上每一个可能的叶子数（k）`0`边，因此它覆盖了每个有效的 trie 形状。 唯一的特殊结构限制是强制`1`非叶后`0`节点，这正是递归中的附加 (f(k)) 项。 

该优化是有效的，因为 (f) 和 (D) 是离散凸的。 因此，分割成本函数是凸函数，三元搜索找到其最小值。 分段表示保持了每个存储段与真实 DP 函数完全一致的不变性。 在段边界处，通过定位递归仍然与当前线性外推一致的最终点来找到下一段。 在该点之后，递归确定新的斜率，因此添加该断点可以保留不变量。 由于每个查询都是从精确的段中评估的，因此返回的值是真正的最佳值。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

MAX_N = 10**15
SEARCH_HIGH = 10**16

def f(n):
    """sum(bit_length(j) for j = 1..n), for n >= 1"""
    b = n.bit_length()
    first = 1 << (b - 1)

    # Sum_{j=1}^{first-1} bit_length(j)
    base = (b - 2) * first + 1

    # j = first .. n all have bit length b
    return base + b * (n - first + 1)

def build_segments():
    # P[i] = first x of segment i
    # S[i] = slope on segment i
    # V[i] = D(P[i])
    P = [1]
    S = [4]
    V = [1]

    def known(x):
        i = bisect_right(P, x) - 1
        return V[i] + S[i] * (x - P[i])

    def next_value(n):
        # k = 1 is special: the 0-child can itself be a leaf.
        lo = 1
        hi = n - 1

        while lo + 3 < hi:
            x1 = (2 * lo + hi) // 3
            x2 = (lo + 2 * hi) // 3

            v1 = known(x1) + known(n - x1) + f(x1)
            v2 = known(x2) + known(n - x2) + f(x2)

            if v1 > v2:
                lo = x1
            else:
                hi = x2

        best = known(n - 1) + 1

        for k in range(lo, hi + 1):
            if k == 1:
                cur = known(n - 1) + 1
            else:
                cur = known(k) + known(n - k) + f(k)
            if cur < best:
                best = cur

        return f(n) + best

    while True:
        left = P[-1] + 1
        right = SEARCH_HIGH

        # Find the last point where the current linear extrapolation
        # is still equal to the recurrence.
        while left < right:
            mid = (left + right + 1) // 2
            if known(mid) == next_value(mid):
                left = mid
            else:
                right = mid - 1

        p = left

        if p > MAX_N:
            break

        value_at_p = known(p)

        # The slope after p is D(p+1) - D(p).
        new_slope = next_value(p + 1) - value_at_p

        P.append(p)
        V.append(value_at_p)
        S.append(new_slope)

    return P, S, V

P, S, V = build_segments()

def answer(n):
    i = bisect_right(P, n) - 1
    return V[i] + S[i] * (n - P[i])

def solve():
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        out.append(str(answer(n)))
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```功能`f`是对 Python 实现重要的第一个优化。 由于区间 ([2^{b-1},2^b-1]) 中的每个 (j) 都具有位长度 (b)，因此可以按位长度对总和进行分组。 Python 整数还消除了在 C++ 实现中需要注意的溢出问题。 

数组`P`,`S`， 和`V`是 DP 的紧凑表示。`known(x)`用途`bisect_right`因为断点属于它的新段。 这个边界约定是必不可少的。 如果 (P=[1,2,\ldots])，精确查询 (x=2) 必须使用从 (2) 开始的段，而不是紧邻其之前结束的段。`next_value`完全遵循递归。 (k=1) 的表达式是故意分开的。 写作`known(1) + known(n - 1) + f(1)`会添加一个人工节点并为 (n=2) 生成错误的答案。 

当剩余的候选数少于四个时，三元搜索停止，然后显式检查剩余的整数值。 这避免了依赖浮点三元搜索并防止最小值附近出现相差一的错误。 

在预处理过程中，`known`是一种推断，而不是保证 DP 在该坐标处已知。 二分查找仅询问该外推法在哪里继续满足递归。 一旦达成第一个分歧，就会引入新的斜率。 存储的段前缀在整个过程中保持准确。 

预处理在下一个断点超过 (10^{15}) 后终止。 搜索上限 (10^{16}) 只是一个方便的安全界限，用于定位下一个断点，而不是声明查询可以达到该值。 

## 工作示例

 对于第一个样本 (n=2)，递归只有一个可能的分割。 

| (n) | (k) | (f(n)) | 之前分割成本 (f(n)) | (f(n)) | (D(n)) | (D(n)) |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | (D(1)+1=2) | 3 | 5 |

 结果是(5)。 特殊的 (k=1) 规则立即可见：左侧码字可以简单地表示为`0`，因此不需要带有成本 (f(1)) 的附加前缀。 

对于第二个样本 (n=4)，相关 DP 值为 (D(1)=1)、(D(2)=5) 和 (D(3)=11)。 

| (n) | (k) | (f(n)) | 之前的候选者 (f(n)) | (f(n)) | 候选人总数 |
 | --- | --- | --- | --- | --- |
 | 4 | 1 | (D(3)+1=12) | 8 | 20 |
 | 4 | 2 | (D(2)+D(2)+f(2)=13) | 8 | 21 | 21
 | 4 | 3 | (D(3)+D(1)+f(3)=17) | 8 | 25 | 25

 最小值通过 (k=1) 获得，给出 (D(4)=20)。 这对应于保持左侧`0`树枝作为单叶，将其他三片叶子放在下面`1`分支，与示例字典后面的结构完全匹配。 

对于第三个样本 (n=10)，最佳值是 (98)。 

| (n) | (k) | (f(10)) | 之前的候选者 (f(10)) | (f(10)) | 候选人总数 |
 | --- | --- | --- | --- | --- |
 | 10 | 10 1 | (D(9)+1=83) | 29 | 29 112 | 112
 | 10 | 10 2 | (D(2)+D(8)+f(2)=75) | 29 | 29 104 | 104
 | 10 | 10 3 | (D(3)+D(7)+f(3)=69) | 29 | 29 98 | 98
 | 10 | 10 4 | (D(4)+D(6)+f(4)=69) | 29 | 29 98 | 98
 | 10 | 10 5 | (D(5)+D(5)+f(5)=71) | 29 | 29 100 | 100

 该轨迹中有两个同样好的中心分裂，(k=3) 和 (k=4)，均给出 (98)。 因此样本输出为 (98)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(M\log^3 N+T\log M)) | 每个断点在其位置上使用二分搜索，并在循环内使用三元搜索，时间常数 (f)。 每个查询都对断点使用二分搜索。 |
 | 空间| (O(M)) | 仅存储断点位置、斜率和值。 |

 这里(N=10^{15})、(T\le 50,000)和(M)仅在所需范围内的(1833)左右。 因此，与线性依赖于 (N) 的任何东西相比，预处理是很小的，并且查询阶段每个测试用例仅执行几十个二分搜索操作。 

## 测试用例

 以下工具假设提交的解决方案放置在名为的函数中`solve_case`。 最大大小测试有意通过相同的预处理机制检查最大的合法输入，而重复值则检查查询是否独立以及段查找是否稳定。```python
# Put the solution's solve_case(n) implementation above this test code.

def run(inp: str) -> str:
    import io
    import sys

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        t = int(sys.stdin.readline())
        ans = []
        for _ in range(t):
            n = int(sys.stdin.readline())
            ans.append(str(solve_case(n)))
        return "\n".join(ans)
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run("""3
2
4
10
""") == """5
20
98""", "provided sample"

# Minimum-size input
assert run("""1
2
""") == "5", "n=2"

# Several small values, including the first slope changes
assert run("""5
3
4
5
6
7
""") == """11
20
30
41
53""", "small DP values"

# Repeated equal values
assert run("""4
10
10
10
10
""") == """98
98
98
98""", "repeated queries"

# Maximum-size input. The result must be a valid integer and the same
# value must be obtained twice, exercising the final piecewise segment.
mx = run("""2
1000000000000000
1000000000000000
""").splitlines()

assert len(mx) == 2, "maximum-size query count"
assert mx[0] == mx[1], "maximum-size repeated query"
assert mx[0].isdigit(), "maximum-size result must be an integer"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 2`|`5`| 最小合法 (n)，包括特殊 (k=1) 转换 |
 |`3,4,5,6,7`|`11,20,30,41,53`| 小 DP 过渡和斜率变化 |
 |`10,10,10,10`|`98,98,98,98`| 重复值和独立测试用例 |
 |`1000000000000000`两次| 相同的整数两次 | 最大输入大小和最终分段线性段 |

 ## 边缘情况

 对于 (n=2)，唯一的分裂在`0`边。 该算法使用`known(n-1)+1`，因此根之前的贡献为 (1+1=2)，根成本为 (f(2)=3)。 结果是(5)。 添加 (f(1)) 的通用拆分公式将错误地返回 (6)。 

对于 (n=4)，最佳分割是 (k=1)。 该算法将特殊候选 (D(3)+1=12) 与普通候选 (D(2)+D(2)+f(2)=13) 和 (D(3)+D(1)+f(3)=17) 进行比较。 添加(f(4)=8)后，答案为(20)。 这会检查强制`1`非叶后`0`子树建模正确。 

对于 (n=10)，最小值出现在多个分割处。 (k=3) 和 (k=4) 的候选都产生 (98)。 整数三元搜索不需要唯一的最小化器，它只需要目标是凸的，因此可以正确处理平坦最小值。 

对于 (n=10^{15})，该算法从不构造 (10^{15}) DP 状态。 它首先构造一小组斜率断点，然后使用一个段查找和一个线性表达式来评估所请求的值。 这种情况将预期的解决方案与任何内存或运行时间随 (n) 增长的 DP 区分开来。
