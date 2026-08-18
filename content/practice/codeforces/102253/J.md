---
title: "CF 102253J - 背包之旅"
description: "有 (n) 种食物类型。 类型(i)占据(i)个体积单位，我们可以在(0)和(ai)个体积之间进行选择。 我们还必须准确选择一种设备类型。"
date: "2026-08-17T21:43:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102253
codeforces_index: "J"
codeforces_contest_name: "2017 Chinese Multi-University Training, BeihangU Contest"
rating: 0
weight: 102253
solve_time_s: 163
verified: true
draft: false
---

[CF 102253J - 背包之旅](https://codeforces.com/problemset/problem/102253/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 种食物类型。 类型(i)占据(i)个体积单位，我们可以在(0)和(a_i)个体积之间进行选择。 我们还必须准确选择一种设备类型。 装备(j)占据(b_j)个体积单位，两个体积相同的装备如果指数不同，仍然是不同的选择。 

背包的容量为(2n)。 如果所选设备的体积为 (b)，则食物必须恰好占据 (2n-b)。 令 (f(s)) 为总体积 (s) 的有效食物选择数量。 最终的答案很简单

 [
 \sum_{j=1}^{m} f(2n-b_j)。 
]

 输入可以包含大约100个测试用例，其中(n)达到(5\cdot 10^4)。 针对 (2n) 个可能体积的二次算法已经太大，并且针对所有 (n) 种食物类型的传统有界背包转换将为 (O(n^2))。 最多五个测试的限制 (n\ge 1000) 告诉我们，需要一个大致 (O(n\sqrt n)) 的解决方案。 内存限制也有利于一些一维数组而不是完整的二维动态程序。 

独特的条件是 (a_1<a_2<\cdots<a_n)。 由于 (a_i) 是不同的非负整数，因此 (a_i\ge i-1)。 这个看似很小的观察结果是使生成函数易于管理的关键。 

有几种边界情况可能会悄悄地破坏粗心的实现。 考虑```
1 1
0
1
```根本没有食物可用，唯一的装备装满了背包，所以答案是`Case #1: 1`。 假设每种食物类型都可以贡献至少一份的实现将被视为不可能的选择。 

重复的装备量也必须保持重复的选择。 为了```
2 3
0 1
4 4 4
```食物的体积必须为零，因此只有一种食物选择。 共有三种不同的设备类型，因此答案是`Case #1: 3`。 对 (b_i) 值进行重复删除将错误地返回 1。 

即使不受限制的分区给出了另一种表示，也必须遵守食物的上限。 为了```
2 1
0 1
2
```唯一可能的食物量是（2），通过取一件类型2获得。禁止取两块类型1，因为（a_1=0）。 答案是`Case #1: 1`。 将分母视为普通的无限制配分函数而不恢复分子因子将计算两个表示。 

同样的边界问题也出现在最大的设备体积上。 如果(b_j=2n)，则所需食物量为零，并且恰好存在一种食物选择，即什么都不吃。 在每次多项式运算中，系数 (f(0)) 必须保持等于 1。 

## 方法

 一种直接的解决方案可以枚举每种食物类型的所有可能的件数，计算其总体积，然后检查剩余容量是否与其中一个设备件匹配。 对于固定设备类型，此检查

 [
 \prod_{i=1}^{n}(a_i+1)
 ]

 食物组合。 因为 (a_i) 不同并且位于 ([0,2n]) 中，所以通过选择 (a_i=n+i) 可以获得最大可能的乘积，给出

 \frac{(2n+1)!}{(n+1)!}。 
]

 乘以 (2n) 种设备类型使得这完全不可行。 即使从 (a_i\ge i-1) 得出的较弱下限 (\prod_i(a_i+1)\ge n!) 对于 (n=5\cdot10^4) 来说也已经是天文数字了。 

通常的动态规划方法在概念上要好得多。 我们可以通过有界背包转换来维护获取每个体积和处理每种食物类型的方法数量。 不幸的是，有 (n) 种类型和 (2n) 种可能的体积，因此直接实现仍然需要 (O(n^2)) 成本。 

压缩问题的有用方法是编写其普通的生成函数。 对于食物类型 (i)，可能的贡献是

 \frac{1-x^{(a_i+1)i}}{1-x^i}。 
]

 因此

 \prod_{i=1}^{n}
 \frac{1-x^{(a_i+1)i}}{1-x^i}。 
]

 只有通过 (x^{2n}) 的系数才重要，因此所有多项式计算都可以对 (x^{2n+1}) 进行模运算。 这是官方社论中使用的主要减少。 

现在考虑分子。 因为 (a_i\ge i-1),

 [
 (a_i+1)i\ge i^2。 
]

 如果 (i^2>2n)，则因子

 [
 1-x^{(a_i+1)i}
 ]

 只是 (1) 模 (x^{2n+1})。 因此，只有 (O(\sqrt n)) 个分子因子可以影响答案。 我们可以在 (O(n\sqrt n)) 时间内将这些因子显式乘以多项式。 

分母类似于整数分区的生成函数：

 [
 P(x)=\prod_{i\ge1}\frac1{1-x^i}
 =\sum_{k\ge0}p(k)x^k。 
]

 欧拉五边形数递推在 (O(n\sqrt n)) 时间内计算 (p(k)) 到 (k=2n)。 标准复发率是

 [
 p(k)=
 \sum_{r\ge1}(-1)^{r+1}
 \左（
 p\left(k-\frac{r(3r-1)}2\right)
 +
 p\left(k-\frac{r(3r+1)}2\right)
 \右）。 
]

 我们需要的分母只有因子 (1,\ldots,n)，而不是全是正整数。 直到次数 (2n)，我们可以写

 P(x)\prod_{i=n+1}^{2n}(1-x^i)。 
]

 任何两个幂 (x^i x^j) 与 (i,j>n) 的乘积都大于 (2n)，因此模 (x^{2n+1})，

 1-\sum_{i=n+1}^{2n}x^i。 
]

 因此，分母系数是使用简单的前缀和从分区数获得的。 这是 (O(n\sqrt n)) 解决方案背后的第二个关键观察结果。 

蛮力方法和最优方法可总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O\左(m\prod_i(a_i+1)\右)) | (O(n)) | (O(n)) | 太慢了 |
 | 有界背包 DP | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 生成函数+五边形递归| (O(n\sqrt n+m)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1.设(N=2n)。 我们只需要从 (0) 到 (N) 的 (F(x)) 系数，因为装备的体积为正，背包容量恰好为 (N)。 
2. 使用欧拉五边形递推计算无限制分区数 (p(0),p(1),\ldots,p(N))。 这里 (p(k)) 使用任意正整数部分大小对 (k) 的分区进行计数。 
3. 将无限制分区序列转换为食物类型的分母 (1,\ldots,n)。 让 (q(k)) 表示系数

 [
 \prod_{i=1}^{n}\frac1{1-x^i}。 
]

对于 (k\le n)，(q(k)=p(k))。 对于(k>n)，额外的不受限制的分区正是那些包含大于(n)的部分的分区。 由于(k\le2n)，最多可以有一个这样的部分。 等价地，使用上面的多项式恒等式，

 [
 q(k)=p(k)-\sum_{r=0}^{k-n-1}p(r)。 
]

 运行前缀和在线性时间内计算每个这样的系数。 

1. 将这些分母系数复制到工作数组 (f) 中。 最初，(f(k)=q(k))，对应于允许每种食物类型出现而没有其上限。 
2. 处理分子因子

 [
 1-x^{(a_i+1)i}。 
]

 对于类型 (i)，定义

 [
 t_i=(a_i+1)i。 
]

 如果(t_i>N)，该因子对我们关心的系数没有影响。 由于 (a_i) 正在增加，值 (t_i) 也在增加，因此我们可以在第一个这样的 (i) 处停止。 

对于每个有用的 (t_i)，将当前多项式乘以 (1-x^{t_i})。 以系数形式表示，

 [
 f[k]\leftarrow f[k]-f[k-t_i]。 
]

 更新必须从大 (k) 一直到 (t_i)。 降序使得每个 (f[k-t_i]) 来自应用该因子之前的多项式，就像零到一背包转换一样。 

1. 应用所有有用的分子因子后，(f(s)) 正是总体积为 (s) 的合法食物选择的数量。 对于每个体积为 (b_j) 的设备，食物的体积必须为 (N-b_j)。 添加

 [
 f[N-b_j]
 ]

 对于每个设备索引（j），保留重复项，因为不同的设备类型代表不同的方式。 

### 为什么它有效

 一种食物类型的生成函数恰好记录该类型的每个允许的件数一次。 将这些因素相乘结合了独立的选择，因此 (x^s) 的系数精确地计算了总体积 (s) 的食物选择。 

将每个有限几何级数替换为

 [
 \frac{1-x^{(a_i+1)i}}{1-x^i}
 ]

 将问题分解为不受限制的分母和修正因子，以删除超出每个上限的选择。 分母通过分区生成函数精确计算，然后每个相关分子因子仅应用一次。 由于所有省略的分子因子的次数都大于 (2n)，因此它们不会影响答案使用的任何系数。 

最后，选择设备 (j) 正好留下 (2n-b_j) 份食物体积，因此对每个设备指数求和一次相应系数，就等于对每个有效包装恰好计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

# Partition numbers p(k), initially p(0) = 1.
part = [1]

def ensure_partitions(N):
    """Extend part[] so that it contains p(0)..p(N)."""
    old = len(part)
    if old > N:
        return

    part.extend([0] * (N + 1 - old))

    pent = []
    r = 1
    while True:
        g1 = r * (3 * r - 1) // 2
        if g1 > N:
            break

        sign = 1 if (r & 1) else -1
        pent.append((g1, sign))

        g2 = r * (3 * r + 1) // 2
        if g2 <= N:
            pent.append((g2, sign))

        r += 1

    # The generalized pentagonal numbers are generated in increasing order.
    for k in range(old, N + 1):
        s = 0
        for g, sign in pent:
            if g > k:
                break
            if sign == 1:
                s += part[k - g]
            else:
                s -= part[k - g]
        part[k] = s % MOD

def solve_case(n, m, a, b):
    N = 2 * n
    ensure_partitions(N)

    # Start with P(x) = sum p(k)x^k.
    f = part[:N + 1]

    # Replace unrestricted partitions by partitions whose parts are <= n.
    # For k > n, subtract sum_{r=0}^{k-n-1} p(r).
    prefix = 0
    for k in range(n + 1, N + 1):
        prefix += part[k - n - 1]
        if prefix >= MOD:
            prefix -= MOD

        value = f[k] - prefix
        if value < 0:
            value += MOD
        f[k] = value

    # Apply the useful numerator factors:
    # product (1 - x^((a_i + 1)i)).
    #
    # Since a_i is increasing, t_i is increasing too.
    for i, ai in enumerate(a, 1):
        t = (ai + 1) * i
        if t > N:
            break

        for k in range(N, t - 1, -1):
            value = f[k] - f[k - t]
            if value < 0:
                value += MOD
            f[k] = value

    # Choose one equipment type. Equal b values are intentionally counted
    # repeatedly because the equipment types themselves are different.
    ans = 0
    for bj in b:
        ans += f[N - bj]
        if ans >= MOD:
            ans -= MOD

    return ans

def solve():
    case_no = 1
    out = []

    while True:
        line = input()
        if not line:
            break

        if not line.strip():
            continue

        n, m = map(int, line.split())

        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        ans = solve_case(n, m, a, b)
        out.append(f"Case #{case_no}: {ans}")
        case_no += 1

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```全球`part`仅当需要更大的 (2n) 值时才扩展数组。 这很重要，因为输入包含许多测试用例，并且为每个测试独立地重新计算分区序列将重复计算中最昂贵的部分。 新追加的 (p(k)) 的重复仅取决于较早的值，因此扩展现有数组是有效的。 

分区递归使用广义五边形数 (r(3r-1)/2) 和 (r(3r+1)/2)。 奇数 (r) 的符号为正，偶数 (r) 的符号为负。 一旦五边形数超过当前度数，内循环就会停止。 

分母修正值得特别注意。 对于(k=n+1)，前缀仅包含(p(0))，因此正好删除具有一部分(n+1)的分区。 对于 (k=2n)，前缀包含 (p(0),\ldots,p(n-1))，覆盖 (n) 上方唯一部分为 (n+1,\ldots,2n) 的每个可能分区。 

分子乘法使用降序索引。 如果循环向上运行，则可以再次使用之前在同一因子中修改的系数，从而有效地多次应用 (1-x^t)。 降序排列可以防止这种污染。 

条件`if t > N: break`是安全的，因为 (t_i=(a_i+1)i) 随 (i) 增加。 这也是分子工作仅为 (O(n\sqrt n)) 的原因。 

Python 中不存在整数溢出问题。 这些值按模 (10^9+7) 减少，甚至分区重复中的临时总和也保持在可管理的整数大小内，因为它仅包含 (O(\sqrt N)) 项。 

## 工作示例

 ### 示例 1

 第一个示例案例是```
1 1
1
1
```这里(n=1)，所以背包容量为(N=2)。 有一种体积为 (1) 的食物类型，最多一件，以及一种体积为 (1) 的装备。 

| 步骤| 状态| 价值|
 | --- | --- | --- |
 | 产能 | (N=2n) | (N=2n) | 2 |
 | 分配系数| (p(0),p(1),p(2)) | (1,1,2) | (1,1,2) |
 | 分母| 零件数最多为 1 | (1,1,1) | (1,1,1) |
 | 分子指数| ((a_1+1)\cdot1) | ((a_1+1)\cdot1) | 2 |
 | 分子后 | (f(0),f(1),f(2)) | (1,1,0) | (1,1,0) |
 | 设备目标| (N-b_1) | 1 |
 | 添加贡献 | (f(1)) | (f(1)) | 1 |

 分子因子 (1-x^2) 消除了对两块 1 类食物的无效选择。 体积一处的系数保持为一，对应于取出一份食物。 

### 示例 2

 第二个示例案例是```
2 2
1 2
3 4
```容量为(N=4)。 类型 1 允许一件，类型 2 允许两件。 

| 步骤| 状态| 价值|
 | --- | --- | --- |
 | 产能 | (N=2n) | (N=2n) | 4 |
 | 分配系数| (p(0)\ldots p(4)) | (p(0)\ldots p(4)) | (1,1,2,3,5) |
 | 分母| 最多允许 2 个零件 | (1,1,2,2,3) | (1,1,2,2,3) |
 | 类型 1 指数 | ((1+1)\cdot1) | ((1+1)\cdot1) | 2 |
 | 类型 1 更新 | 乘以 (1-x^2) | (1,1,1,1,1) | (1,1,1,1,1) |
 | 类型 2 指数 | ((2+1)\cdot2) | ((2+1)\cdot2) | 6 |
 | 类型 2 更新 | 指数超过 4 | 不变|
 | 装备1目标| (4-3) | 1 |
 | 装备2目标| (4-4) | 0 |
 | 总计 | (f(1)+f(0)) | 2 |

 第一个分子因子删除了包含两个类型 1 的无限制表示。第二个因子不能影响到 4 的度数，因为它的指数是 6。 两种设备选择都只有一种兼容的食物选择，总共有两种方式。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\sqrt n+m)) 每个大型测试 | 分区重复成本 (O(n\sqrt n))、有用分子因子成本 (O(n\sqrt n))、设备处理成本 (O(m)) |
 | 空间| (O(n)) | (O(n)) | 两个长度为 (2n+1) 的系数数组，加上 (a) 和 (b) 数组 |

 最大相关多项式次数为 (2n\le10^5)。 只有 (O(\sqrt n)) 分子因子才重要，因为它们的指数至少为 (i^2)。 最多五个测试用例的限制 (n\ge10^3)​​ 可以控制昂贵的工作总量，而较小的用例需要的操作要少得多。 该实现还跨测试用例重用分区序列。 

## 测试用例```python
import sys
import io

MOD = 1_000_000_007

part = [1]

def ensure_partitions(N):
    old = len(part)
    if old > N:
        return

    part.extend([0] * (N + 1 - old))

    pent = []
    r = 1
    while True:
        g1 = r * (3 * r - 1) // 2
        if g1 > N:
            break

        sign = 1 if r & 1 else -1
        pent.append((g1, sign))

        g2 = r * (3 * r + 1) // 2
        if g2 <= N:
            pent.append((g2, sign))

        r += 1

    for k in range(old, N + 1):
        s = 0
        for g, sign in pent:
            if g > k:
                break
            s += sign * part[k - g]
        part[k] = s % MOD

def solve_case(n, m, a, b):
    N = 2 * n
    ensure_partitions(N)

    f = part[:N + 1]

    prefix = 0
    for k in range(n + 1, N + 1):
        prefix += part[k - n - 1]
        if prefix >= MOD:
            prefix -= MOD

        f[k] -= prefix
        if f[k] < 0:
            f[k] += MOD

    for i, ai in enumerate(a, 1):
        t = (ai + 1) * i
        if t > N:
            break

        for k in range(N, t - 1, -1):
            f[k] -= f[k - t]
            if f[k] < 0:
                f[k] += MOD

    ans = 0
    for bj in b:
        ans += f[N - bj]
        if ans >= MOD:
            ans -= MOD

    return ans

def solution():
    input = sys.stdin.readline
    case_no = 1
    out = []

    while True:
        line = input()
        if not line:
            break

        if not line.strip():
            continue

        n, m = map(int, line.split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        out.append(f"Case #{case_no}: {solve_case(n, m, a, b)}")
        case_no += 1

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        # Reuse the same global partition cache as the actual solution.
        exec_result = solution()
        sys.stdout.write(exec_result)
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples.
sample = """\
1 1
1
1
2 2
1 2
3 4
3 3
1 2 3
2 3 3
"""

assert run(sample) == (
    "Case #1: 1\n"
    "Case #2: 2\n"
    "Case #3: 6"
), "provided samples"

# Minimum-size input, with no food available.
assert run("""\
1 1
0
1
""") == "Case #1: 1", "minimum-size case"

# All equipment volumes are equal, so every equipment type must be counted.
assert run("""\
2 3
0 1
4 4 4
""") == "Case #1: 3", "duplicate equipment types"

# Boundary case for a food upper bound.
# With a = [0, 1], volume 2 can only be formed by one type-2 food.
assert run("""\
2 1
0 1
2
""") == "Case #1: 1", "food upper-bound boundary"

# Maximum n. Choosing equipment of volume 2n leaves zero volume for food,
# so the answer is exactly one regardless of the many food types.
n = 50000
a = " ".join(str(i) for i in range(n))
large_input = f"{n} 1\n{a}\n{2 * n}\n"
assert run(large_input) == "Case #1: 1", "maximum-size boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 0 / 1`|`Case #1: 1`| 最小尺寸和零食物供应 |
 |`2 3 / 0 1 / 4 4 4`|`Case #1: 3`| 相同的设备体积必须保持单独的选择|
 |`2 1 / 0 1 / 2`|`Case #1: 1`| 食品上限和分子修正|
 | (n=50000,\a_i=i-1,\b_1=100000) |`Case #1: 1`| 最大尺寸和 (b=2n) 边界 |

 ## 边缘情况

 当食物上限为零时，其整个生成函数因子仅为 (1)。 为了```
1 1
0
1
```其分子修正的指数为((0+1)\cdot1=1)，因此食物生成函数为

 [
 \frac{1-x}{1-x}=1。 
]

 唯一的食物体积为零，装备体积一消耗剩余单位。 该算法产生`Case #1: 1`。 

当多种装备类型体积相同时，不得合并。 为了```
2 3
0 1
4 4 4
```每个设备项目的食物量都为零。 系数 (f(0)=1)，最后的循环将该系数相加 3 次。 结果是`Case #1: 3`。 

对于上限修正示例```
2 1
0 1
2
```不受限制的分母允许使用第一部分和第二部分进行两部分划分，给出两种可能性：(1+1) 和 (2)。 类型 1 的分子因子是 (1-x)，因为 (a_1=0)，而类型 2 的分子因子是 (1-x^4)。 乘以 (1-x) 删除 (1+1) 表示，留下 (f(2)=1)。 所需食物量为两份，故答案为`Case #1: 1`。 

当设备装满整个背包时，所需食物量为零。 对于 (n=50000)、(a_i=i-1) 和 (b_1=100000=2n) 的最大尺寸测试，每个分子和分母运算都保留 (f(0)=1)。 最终的查找是 (f(0))，所以答案恰好是 1。 这也验证了系数数组包含零度并且表达式`N - bj`永远不需要负索引，因为每个设备的体积最多为 (N)。 

多项式构造中最微妙的边界出现在 (2n) 次。 任意两个因子 (x^i) 和 (x^j) 与 (i,j>n) 的乘积的次数大于 (2n)，因此可以安全地丢弃这些交叉项。 这正是分母校正减少为一个前缀和减法而不需要另一项多项式乘法的原因。 

分子具有相反类型的边界。 指数恰好为 (2n) 的因子仍然会改变次数为 (2n) 的系数，因此条件必须是`t > N`， 不是`t >= N`。 降序更新包括`k=N`什么时候`t=N`，这是正确消除该贡献所必需的。
