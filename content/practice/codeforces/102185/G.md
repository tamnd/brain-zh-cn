---
title: "CF 102185G - \u0413\u0438\u0440\u043b\u044f\u043d\u0434\u0430"
description: "花环由两个参数控制。 在整数时间（S）开启后，保持亮（A）分钟，然后保持暗（A）分钟，并永远重复这个循环。 在时间（S）之前，天很黑，因为花环还没有打开。"
date: "2026-08-20T00:39:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "G"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 306
verified: true
draft: false
---

[CF 102185G - \u0413\u0438\u0440\u043b\u044f\u043d\u0434\u0430](https://codeforces.com/problemset/problem/102185/G)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 花环由两个参数控制。 在整数时间（S）开启后，保持亮（A）分钟，然后保持暗（A）分钟，并永远重复这个循环。 在时间（S）之前，天很黑，因为花环还没有打开。 

假日占据区间([0,T])。 在此间隔期间，至少有一半的时间必须点亮。 同时，祖父在几个不相交的间隔 ([L_i,R_i]) 中在家，我们希望最小化它们与花环的点亮部分相交的总长度。 

答案包括最小不可避免的重叠、所选择的 (A) 和切换时间 (S)。 在相等的重叠中，我们更喜欢较小的 (A)，而在相等的 (A) 中，我们更喜欢较晚的切换时间。 

所有端点都是整数，因此我们可以将每一分钟 ([t,t+1)) 视为一个离散位置。 祖父区间 ([L,R]) 恰好占据位置 (L,L+1,\ldots,R-1)。 

界限（T\le 5000）是主要线索。 (O(T^2)) 解决方案是现实的，而扫描每对 ((A,S)) 所有 (T) 分钟的方法则过于昂贵。 祖父区间的数量最多为 (T/2)，因此 (O(NT)) 分量也可以作为 (O(T^2)) 解决方案的一部分。 

有几种边界情况很容易破坏看似正确的实现。 首先是花环在开启之前不会定期运行。 例如，```
4 0
```有答案```
0 1 1
```因为在 (A=1) 和 (S=1) 的情况下，花环在 ([1,2)) 和 ([3,4)) 期间点亮，正好是假期的一半。 将 (S) 之前的模式视为周期性模式会错误地认为 (S=1) 等于 (S=-1)。 

第二个边缘情况是假期前的切换时间。 为了```
8 2
1 3
5 7
```答案是```
0 2 -1
```当 (A=2) 和 (S=-1) 时，花环在 ([0,1))、([3,5)) 和 ([7,8)) 期间点亮，正好给出四分钟点亮时间，同时避免两个祖父间隔。 仅考虑 (S\ge0) 的解决方案会错过最佳值。 

当切换时间恰好在祖父间隔的开始处时，出现第三种边缘情况。 为了```
4 1
1 2
```答案是```
0 2 2
```花环在 ([2,4)) 上点亮，给出两分钟的点亮时间和零重叠。 这里常见的错误是将端点 (2) 视为属于区间 ([1,2])。 这些是时间间隔，因此它们的交集长度为零。 

最后，(A) 不需要考虑超出 (T) 的范围。 如果(A>T)，最多有一个点亮的线段可以与节假日相交。 这样的片段可以是前缀、后缀或整个假日，并且可以用(A=T)再现相同的点亮片段。 由于较小的 (A) 获胜，因此考虑 (A\le T) 就足够了。 

## 方法

 直接蛮力在概念上很简单。 我们可以尝试从（1）到（T）中的每一个（A），每一个相关的整数切换时间（S），逐分钟模拟花环，计算其点亮持续时间，并单独计算有多少点亮分钟属于祖父间隔。 每个候选人都经过严格检查，因此方法是正确的。 

对于固定的 (A)，负开关时间只需要来自 ([-2A,-1]) 的代表，因为在花环已经打开后，将 (S) 移动 (2A) 不会改变周期模式。 对于非负 (S)，可行解不可能有 (S>\lfloor T/2\rfloor)，因为最多还剩下 (T-S) 分钟。 这给出了 (O(2A+T)) 候选者从一 (A) 开始。 如果每个候选人都扫描所有（T）分钟，最坏的情况大约是

 [
 T\左(\sum_{A=1}^{T} (2A+T/2)\右)
 ]

 操作，大约是 (T=5000) 处的 (1.9\cdot10^{11}) 操作。 这远未达到一秒的限制。 

关键的观察结果是，对于固定的 (A)，无限周期模式仅取决于 (S\bmod 2A)。 如果我们知道，对于每个余数模 (2A)，有多少个假期分钟和多少个祖父分钟有该余数，那么将 (S) 移一只会从点亮的半周期中删除一个残数类别并添加另一个。 因此可以在(O(1))中更新完整的相关值。 

有一个并发症。 对于 (S\ge0)，周期公式会错误地说明 (S) 之前的时间。 我们通过维持前缀 ([0,S)) 中的光照重量来处理这个问题。 当(S)增加1时，点亮残差类别的集合移动1，使得前缀贡献也可以使用针对已处理的前缀累积的残差总和在(O(1))中更新。 

(2A>T) 有一个额外的简化。 周期 (2A) 比整个假期长，因此假期只能包含一个亮起的段。 (A) 的问题变成了一个简单的区间交集问题，可以直接根据祖父占用率的前缀和进行评估。 

最终的方法是 (O(T^2))，仅使用 (O(T)) 内存。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(T^3)) | (O(T)) | 太慢了 |
 | 最佳| (O(T^2)) | (O(T)) | 已接受 |

 ## 算法演练

 1. 构建数组`g[t]`对于 (0\le t<T)，其中`g[t]=1`恰好在 ([t,t+1)) 分钟内祖父在家的时间。 还构建其前缀和。 这让我们可以找到 (O(1)) 中任何普通区间的祖父重叠。 
2. 考虑从 (1) 到 (T) 的每个 (A)。 上面的值 (T) 是不必要的，因为由这样的 (A) 产生的任何可行模式都可以用 (A=T) 再现。 
3. 如果(2A>T)，则该期间比假期长。 ([0,T]) 内亮起的部分是单个区间。 对于每个可行的切换时间 (S)，将 ([S,S+A)) 与 ([0,T]) 相交，计算其长度，并计算其与前缀和的祖父重叠。 对于负值 (S)，左端点被剪裁为零，因为花环在假期前已打开。 
4. 对于 (2A\le T)，设 (P=2A)。 建造`cnt[r]`，时间与 (r\pmod P) 一致的假期分钟数，以及`home[r]`，具有相同余数的祖父分钟数。 从残基 (S\bmod P) 开始的周期性模式的点亮部分恰好由 (A) 个连续残基组成。 
5. 构建 (S=0) 的周期性点亮持续时间和周期性祖父重叠。 这些是残数 (0,\ldots,A-1) 的总和。 当 (S) 从 (S) 变为 (S+1) 时，留数 (S\bmod P) 离开照亮的一半，而留数 ((S+A)\bmod P) 进入其中。 因此，只要访问两次数组，两个总数就会发生变化。 
6. 使用代表 (S=-P+1,\ldots,-1) 枚举负开关时间。 负开始意味着花环已经开始，因此定期计算是假期的实际行为。 代表（-P）与（0）具有相同的假期模式，但更早，因此可以跳过。 
7. 处理非负切换时间 (S=0,\ldots,\lfloor T/2\rfloor)。 周期性总计仍然描述了在 (S) 之前延伸的假设模式，因此减去该模式位于 ([0,S)) 中的部分。 增量地维护此前缀贡献。 当从 (S) 移动到 (S+1) 时，旧前缀失去余数 (S\bmod P)，获得余数 ((S+A)\bmod P)，而新添加的分钟 (S) 在新模式中不会点亮，因为其相对时间为零。 
8. 对于每位候选人，要求`2 * lit >= T`。 如果可行，将其祖父重叠与当前答案进行比较。 比较首先最小化重叠，然后 (A)，然后最大化 (S)。 
9. 打印最佳三元组。 

周期部分背后的不变量是`period_lit`和`period_home`始终等于通过将无限周期模式与当前切换阶段应用到整个假期间隔而获得的总和。 前缀变量始终等于限制在实际切换时间之前几分钟的相同总和。 它们的区别正是真正的花环的行为，在打开之前它是黑暗的。 由于枚举了每个相关相位并且处理了每个相关非负切换时间，因此保证找到最佳可行候选。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(data=None):
    if data is None:
        T, N = map(int, input().split())
        intervals = [tuple(map(int, input().split())) for _ in range(N)]
    else:
        it = iter(map(int, data.split()))
        T = next(it)
        N = next(it)
        intervals = [(next(it), next(it)) for _ in range(N)]

    # g[t] = 1 iff the grandfather is home during minute [t, t+1).
    diff_g = [0] * (T + 1)
    for l, r in intervals:
        diff_g[l] += 1
        diff_g[r] -= 1

    g = [0] * T
    cur = 0
    for t in range(T):
        cur += diff_g[t]
        g[t] = 1 if cur else 0

    # Prefix sum of grandfather occupancy.
    pref_g = [0] * (T + 1)
    for t in range(T):
        pref_g[t + 1] = pref_g[t] + g[t]

    half_floor = T // 2
    half_ceil = (T + 1) // 2

    best_cost = T + 1
    best_a = 0
    best_s = 0

    def consider(cost, a, s):
        nonlocal best_cost, best_a, best_s
        if cost < best_cost:
            best_cost = cost
            best_a = a
            best_s = s
        elif cost == best_cost and a == best_a and s > best_s:
            best_s = s

    for A in range(1, T + 1):
        # If the period is longer than the holiday, there can be
        # only one lit segment inside [0, T].
        if 2 * A > T:
            lo = half_ceil - A

            for s in range(lo, half_floor + 1):
                left = max(0, s)
                right = min(T, s + A)

                lit = right - left
                if 2 * lit < T:
                    continue

                cost = pref_g[right] - pref_g[left]
                consider(cost, A, s)

            continue

        P = 2 * A

        # home[r] = number of grandfather minutes t with t % P == r.
        #
        # Each grandfather interval contributes q to every residue,
        # plus one to a cyclic range of length rem.
        home_diff = [0] * (P + 1)
        base = 0

        for l, r in intervals:
            length = r - l
            q, rem = divmod(length, P)
            base += q

            if rem:
                start = l % P
                end = start + rem

                if end <= P:
                    home_diff[start] += 1
                    home_diff[end] -= 1
                else:
                    home_diff[start] += 1
                    home_diff[P] -= 1
                    home_diff[0] += 1
                    home_diff[end - P] -= 1

        home = [0] * P
        cur = 0
        for r in range(P):
            cur += home_diff[r]
            home[r] = cur + base

        # cnt[r] = number of holiday minutes with t % P == r.
        q, rem = divmod(T, P)
        cnt = [q + (1 if r < rem else 0) for r in range(P)]

        # Phase S = 0, whose lit residues are [0, A).
        period_lit = sum(cnt[:A])
        period_home = sum(home[:A])

        # Negative starts. For s < 0 the periodic pattern is real,
        # because the garland has already been switched on.
        cur_lit = period_lit
        cur_home = period_home

        for r in range(1, P):
            cur_lit += cnt[(r + A - 1) % P] - cnt[r - 1]
            cur_home += home[(r + A - 1) % P] - home[r - 1]

            s = -P + r

            if 2 * cur_lit >= T:
                consider(cur_home, A, s)

        # Nonnegative starts.
        cur_lit = period_lit
        cur_home = period_home

        # pref_cnt[r] and pref_home[r] contain the already processed
        # prefix [0, s), grouped by residue modulo P.
        pref_cnt = [0] * P
        pref_home = [0] * P

        # s = 0: nothing has to be removed from the periodic pattern.
        if 2 * cur_lit >= T:
            consider(cur_home, A, 0)

        for s in range(half_floor):
            r1 = s % P
            r2 = (s + A) % P

            # Shift the infinite periodic phase by one.
            cur_lit += cnt[r2] - cnt[r1]
            cur_home += home[r2] - home[r1]

            # Shift the part lying before the actual switch time.
            removed_lit = pref_cnt[r2] - pref_cnt[r1]
            removed_home = pref_home[r2] - pref_home[r1]

            pref_cnt[r1] += 1
            pref_home[r1] += g[s]

            actual_lit = cur_lit - removed_lit
            actual_home = cur_home - removed_home

            ns = s + 1

            if 2 * actual_lit >= T:
                consider(actual_home, A, ns)

    return f"{best_cost} {best_a} {best_s}"

if __name__ == "__main__":
    sys.stdout.write(solve() + "\n")
```第一部分构造分钟级祖父占用率及其前缀和。 因为所有间隔端点都是整数，所以这种表示是精确的，而不是连续时间的近似值。 

分行`2 * A > T`利用周期 (2A) 比整个假期长的事实。 假期内不可能有第二个点亮的部分，因此花环由单个间隔表示。 候选范围开始于`half_ceil - A`，这是最早的负切换时间，其亮灯路口可以达到假日的一半。 

为了`2 * A <= T`，代码构建残差计数模`P = 2 * A`。 祖父残差数组是通过差异数组范围更新来构造的。 长度区间`q * P + rem`贡献`q`每一个残留物和一个额外的单位`rem`连续的循环残基。 这避免了扫描所有 (T) 分钟以查找 (A) 的每个值。 

两个变量`period_lit`和`period_home`描述假设的无限模式。 负启动循环可以直接使用它们，因为花环在时间零之前已经打开。 

正启动循环更加微妙。`pref_cnt`和`pref_home`描述位于实际切换之前的周期性模式的部分。 更新发生在插入分钟之前`s`到这些数组中。 这个顺序很重要，因为分钟`s`不在新的切换时间之前`s+1`，但它在相对时间零时也不会被新相位点亮。 

可行性测试使用`2 * lit >= T`而不是浮点除法。 这可以准确处理 (T) 的奇数值。 例如，如果(T=5)，则至少需要三分钟点亮。 

打破平局的代码依赖于按升序迭代 (A)。 对于同等成本，较大的 (A) 永远不会取代已存储的解决方案。 对于相同的（A），只有当其切换时间较晚时，候选者才会替换当前的候选者。 

## 工作示例

 ### 示例 1

 输入是```
10 2
1 4
7 10
```考虑（A=1）。 它的周期是 (2)，因此每隔一分钟就会以周期模式点亮。 

| 开始（S）| 定期点亮| 删除了前缀 lit | 实际点亮| 祖父重叠| 可行|
 | --- | ---| ---| --- | ---| ---|
 | -1 | 5 | 0 | 5 | 4 | 是的 |
 | 0 | 5 | 0 | 5 | 2 | 是的 |
 | 1 | 5 | 0 | 5 | 4 | 是的 |
 | 2 | 5 | 1 | 4 | 2 | 没有 |

 (A=1) 的最佳候选是 (S=0)，有重叠 (2)。 较大的 (A) 无法改善答案，因此最终结果是```
2 1 0
```这里重要的细节是 (S=-1) 和 (S=1) 之间的差异。 它们的周期相位是相关的，但真正的花环在其实际切换时间之前是黑暗的。 前缀减法抓住了这种区别。 

### 示例 2

 输入是```
8 2
1 3
5 7
```对于 (A=2)，周期为 (4)。 负相（S=-1）点亮分钟（0,3,4,7），正好四分钟。 

| 开始（S）| 定期点亮| 删除了前缀 lit | 实际点亮| 祖父重叠| 可行|
 | ---| ---| ---| ---| --- | ---|
 | -1 | 4 | 0 | 4 | 0 | 是的 |
 | 0 | 4 | 0 | 4 | 2 | 是的 |
 | 1 | 4 | 0 | 4 | 4 | 是的 |
 | 2 | 4 | 1 | 3 | 2 | 没有 |

 负的开始完全避免了祖父间隔，同时仍然照亮了假期的一半。 因此答案是```
0 2 -1
```此示例练习了算法的一部分，该部分必须保留真正的负切换时间，而不是用非负相位代表替换它们。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(T^2)) | 对于每个 (A)，残差构建和所有候选更新都需要 (O(N+T)) 和 (N\le T/2)。 |
 | 空间| (O(T)) | 所有残差数组在周期分支中的长度最多为 (2A\le T)。 |

 (T) 的最大值仅为 (5000)，因此 (O(T^2)) 意味着算法主要部分的大约 (25) 万次规模运算。 该解决方案从不扫描每个单独切换时间的所有 (T) 分钟，这是公认方法和蛮力方法之间的区别。 

## 测试用例```python
import io
import sys

def solve(data=None):
    if data is None:
        T, N = map(int, input().split())
        intervals = [tuple(map(int, input().split())) for _ in range(N)]
    else:
        it = iter(map(int, data.split()))
        T = next(it)
        N = next(it)
        intervals = [(next(it), next(it)) for _ in range(N)]

    diff_g = [0] * (T + 1)
    for l, r in intervals:
        diff_g[l] += 1
        diff_g[r] -= 1

    g = [0] * T
    cur = 0
    for t in range(T):
        cur += diff_g[t]
        g[t] = 1 if cur else 0

    pref_g = [0] * (T + 1)
    for t in range(T):
        pref_g[t + 1] = pref_g[t] + g[t]

    half_floor = T // 2
    half_ceil = (T + 1) // 2

    best_cost = T + 1
    best_a = 0
    best_s = 0

    def consider(cost, a, s):
        nonlocal best_cost, best_a, best_s
        if cost < best_cost:
            best_cost = cost
            best_a = a
            best_s = s
        elif cost == best_cost and a == best_a and s > best_s:
            best_s = s

    for A in range(1, T + 1):
        if 2 * A > T:
            lo = half_ceil - A

            for s in range(lo, half_floor + 1):
                left = max(0, s)
                right = min(T, s + A)
                lit = right - left

                if 2 * lit < T:
                    continue

                cost = pref_g[right] - pref_g[left]
                consider(cost, A, s)

            continue

        P = 2 * A

        home_diff = [0] * (P + 1)
        base = 0

        for l, r in intervals:
            length = r - l
            q, rem = divmod(length, P)
            base += q

            if rem:
                start = l % P
                end = start + rem

                if end <= P:
                    home_diff[start] += 1
                    home_diff[end] -= 1
                else:
                    home_diff[start] += 1
                    home_diff[P] -= 1
                    home_diff[0] += 1
                    home_diff[end - P] -= 1

        home = [0] * P
        cur = 0
        for r in range(P):
            cur += home_diff[r]
            home[r] = cur + base

        q, rem = divmod(T, P)
        cnt = [q + (1 if r < rem else 0) for r in range(P)]

        period_lit = sum(cnt[:A])
        period_home = sum(home[:A])

        cur_lit = period_lit
        cur_home = period_home

        for r in range(1, P):
            cur_lit += cnt[(r + A - 1) % P] - cnt[r - 1]
            cur_home += home[(r + A - 1) % P] - home[r - 1]

            s = -P + r
            if 2 * cur_lit >= T:
                consider(cur_home, A, s)

        cur_lit = period_lit
        cur_home = period_home

        pref_cnt = [0] * P
        pref_home = [0] * P

        if 2 * cur_lit >= T:
            consider(cur_home, A, 0)

        for s in range(half_floor):
            r1 = s % P
            r2 = (s + A) % P

            cur_lit += cnt[r2] - cnt[r1]
            cur_home += home[r2] - home[r1]

            removed_lit = pref_cnt[r2] - pref_cnt[r1]
            removed_home = pref_home[r2] - pref_home[r1]

            pref_cnt[r1] += 1
            pref_home[r1] += g[s]

            actual_lit = cur_lit - removed_lit
            actual_home = cur_home - removed_home

            ns = s + 1

            if 2 * actual_lit >= T:
                consider(actual_home, A, ns)

    return f"{best_cost} {best_a} {best_s}"

def run(inp: str) -> str:
    return solve(inp)

assert run("""10 2
1 4
7 10
""") == "2 1 0", "sample 1"

assert run("""8 2
1 3
5 7
""") == "0 2 -1", "sample 2"

assert run("""6 1
0 4
""") == "1 3 3", "sample 3"

assert run("""5 1
0 5
""") == "3 1 0", "sample 4"

assert run("""4 0
""") == "0 1 1", "sample 5"

assert run("""1 0
""") == "0 1 0", "minimum-size input"

assert run("""4 1
1 2
""") == "0 2 2", "boundary endpoint"

assert run("""6 2
0 2
4 6
""") == "2 1 1", "equal intervals"

assert run("""5000 0
""") == "0 1 1", "maximum T"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| --- | --- |
 |`1 0`|`0 1 0`| 尽可能最小的假期和切换时间边界|
 |`4 1 / 1 2`|`0 2 2`| 祖父离开后的精确区间端点和切换 |
 |`6 2 / 0 2 / 4 6`|`2 1 1`| 等长祖父间隔和最后开始的平局决胜负
 |`5000 0`|`0 1 1`| 最长假期长度和迟到决胜局 |

 ## 边缘情况

 对于最小输入```
1 0
```唯一的一分钟必须点亮至少一分钟假期的一半，这意味着一整分钟。 当 (A=1) 时，在 (S=0) 处切换灯 ([0,1))，从而实现零祖父重叠。 在假期期间切换到 (S=1) 不会点亮任何灯，所以答案是```
0 1 0
```该算法立即到达 (2A>T) 分支，进行测试 (S=0)，并拒绝 (S=1)，因为其点亮持续时间为零。 

对于负启动情况```
8 2
1 3
5 7
```相关候选者是(A=2,S=-1)。 由于(2A=T)，所以使用周期性分支。 相位点亮余数 (0) 和 (3) 模 (4)，每次点亮四分钟 (0,3,4,7)。 没有一个属于祖父区间，因此成本为零。 负相枚举直接找到该候选者。 

对于端点情况```
4 1
1 2
```候选者 (A=2,S=2) 产生点亮区间 ([2,4))。 它与祖父区间 ([1,2)) 的交集是空的，而假期正好包含两分钟。 大周期分支计算`left=2`,`right=4`，并得到成本`pref_g[4] - pref_g[2] = 0`。 

对于等间隔情况```
6 2
0 2
4 6
```最好的解决方案是（A=1，S=1）。 花环在 (1,3,5) 分钟内点亮，正好点亮三分钟，满足半假日条件。 它在 (1) 和 (5) 分钟内与祖父间隔相交，因此成本为 2。 在 (S=0) 处切换也给出成本 2，但平局决胜规则选择较晚的开始 (S=1)。 

最长假期长度```
5000 0
```没有祖父，所以目标为零。 最小的可能 (A) 是 (1)。 当 (S=1) 时，花环从 (1) 到 (4999) 每隔一分钟点亮一次，正好给出 (2500) 点亮分钟。 如果晚点开始，假期里只有不到一半的时间会亮灯。 结果的答案是```
0 1 1
```当许多配置具有零成本时，最后一种情况也运用了平局打破规则：算法保持（A=1），然后为该（A）选择最新的可行切换时间。
