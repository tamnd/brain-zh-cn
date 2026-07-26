---
title: "CF 104053G - 游戏"
description: "两名玩家通过将选定的整数相乘来重复累积数字。 Alice 控制集合 $A$，Bob 控制集合 $B$。 两者都以值 $alpha = 1$ 和 $beta = 1$ 开头。 每次 Alice 移动时，她都会从 $A$ 中选取任何元素并将其乘以 $alpha$。"
date: "2026-07-02T03:36:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104053
codeforces_index: "G"
codeforces_contest_name: "2022 China Collegiate Programming Contest (CCPC) Guangzhou Onsite"
rating: 0
weight: 104053
solve_time_s: 68
verified: true
draft: false
---

[CF 104053G - 游戏](https://codeforces.com/problemset/problem/104053/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 两名玩家通过将选定的整数相乘来重复累积数字。 爱丽丝控制组$A$, Bob 控制集$B$。 两者都从价值观开始$\alpha = 1$和$\beta = 1$。 在爱丽丝的每一步动作中，她都会从中选择任何元素$A$并将其乘以$\alpha$。 在鲍勃的每一步动作中，他都会从中选择任何元素$B$并将其乘以$\beta$。 这个过程永远交替进行，从爱丽丝开始。 

鲍勃的获胜条件很简单，但在时间上是全局的：如果在任何时刻$\alpha$划分$\beta$，鲍勃立即获胜。 爱丽丝从来没有直接获胜的条件； 她的目标只是避免达到鲍勃可以强制这种整除条件的状态。 

我们可以从其中删除任何元素子集$A$比赛开始前。 删除元素后，用剩余的数字进行游戏$A$。 如果删除子集不会改变 Alice 在最佳游戏下仍然可以避免失败的事实，则该子集被称为有效。 我们必须计算有多少子集是有效的。 

约束足够小，因式分解和每元素推理都是可行的。 两个集合都最多包含 500 个数字，并且每个数字最多为 500。这立即表明素数分解是正确的语言，因为乘法下的所有交互都可以在素数上干净地分解。 任何尝试直接模拟游戏玩法的解决方案都太慢，因为游戏是无限的，并且每次选择的分支都是指数级的。 

一个微妙的边缘情况是，即使没有删除任何东西，爱丽丝也已经输了。 例如，如果鲍勃可以保证$\alpha \mid \beta$从一开始无论策略如何，那么没有子集可以帮助爱丽丝，并且答案必须为零。 另一个极端情况是空子集$A$。 删除一切使$\alpha$永远保持在 1，所以 Bob 从一开始就轻松获胜$\beta$也从 1 开始，因此可立即整除。 这意味着空子集永远无效。 

## 方法

 对游戏的幼稚解释试图模拟最佳游戏。 在每一步中，爱丽丝和鲍勃都会选择最大化自己目标的行动。 蛮力国家需要跟踪当前的值$\alpha$和$\beta$，无限制地乘法增长，并且还考虑了双方未来的所有选择。 即使我们压缩值，分支因子仍然存在$|A| \cdot |B|$每一步，游戏没有自然终止界限。 这使得直接游戏模拟变得不可行。 

关键的观察结果来自于用素数指数重写整除条件。 将每个数字写为 500 以内素数的指数向量。然后$\alpha \mid \beta$等价于每个素数有指数$\alpha$不超过$\beta$。 由于乘法会添加指数，因此每次移动都会添加这些向量之一。 

现在游戏变成了多个独立坐标上的竞争。 在每一回合，爱丽丝都会添加一个向量$A$，鲍勃添加了一个来自$B$。 由于它们可以重用元素，因此长期行为取决于哪些向量在每个方向上最大化增长。 对于固定素数$p$，只有任何元素贡献的最大指数才渐近重要，因为重复选择最佳贡献者在任何混合策略中都占主导地位。 

这将游戏减少到比较，对于每个素数$p$，Alice 和 Bob 可用的最大指数。 如果鲍勃的最大值至少是爱丽丝对于每个素数的最大值，那么鲍勃最终可以在每个坐标和力整除性上匹配或超过爱丽丝。 否则，如果存在一个素数，其中爱丽丝有严格更大的最大贡献者，她可以永远保持该坐标领先，防止鲍勃的获胜条件。 

一旦这个特征可用，子集问题就变得纯粹是结构性的。 从中删除元素$A$改变爱丽丝的每个质数的最大指数。 当删除后仍然存在至少一个素数且 Alice 的剩余最大值超过 Bob 的固定最大值时，子集是有效的。 

这将问题转化为计算子集，以避免破坏所有“获胜素数”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解游戏模拟| 指数级移动 | 大状态空间| 太慢了|
 | 素因子 + 子集计数 |$O(n \cdot P + n \log n)$|$O(n \cdot P)$| 已接受 |

 ## 算法演练

 我们首先预先计算 500 以内的所有数字的质因数分解，以便每个数字都可以表示为指数向量。 

1. 将每个数字因式分解$B$，并计算每个素数$p$的所有元素中出现的最大指数$B$。 打电话给这个$maxB[p]$。 这捕捉了鲍勃在每个坐标中可能最强的增长。 
2. 将每个数字因式分解$A$，并类似地计算$maxA[p]$，全套中存在的最大指数$A$。 这告诉我们在进行任何删除之前，Alice 是否在每个主要方向上都处于全局领先地位。 
3. 如果对于每个素数$p$,$maxA[p] \le maxB[p]$，那么 Bob 在所有坐标上已经支配或匹配 Alice。 在这种情况下，即使拥有完整的集合，爱丽丝也无法保持任何优势，因此每个子集都会失败，答案为零。 
4. 否则，确定哪些要素$A$是“安全的”。 如果对于每个素数，一个元素是安全的$p$，其指数不超过$maxB[p]$。 这些元素不能单独推动任何坐标超出鲍勃的能力。 
5.让$k$是安全元素的数量。 任何仅由安全元素组成的子集都无法创建 Alice 超过 Bob 的素数，因此所有此类子集都将失去 Alice 的位置。 
6. 因此，无效子集恰好是安全元素的所有子集，即$2^k$。 子集总数为$2^{|A|}$，因此有效子集等于$2^{|A|} - 2^k$，取模$10^9+7$。 

这样做的原因是，只有每个素数的最大指数对于长期主导条件来说很重要。 任何超过鲍勃在至少一个素数范围内的元素都足以潜在地保持爱丽丝在该坐标上的优势，因此删除所有这些元素会破坏她唯一的获胜方向。 相反，保留至少一个这样的元素可以保留至少一个坐标，让 Alice 可以无限期地保持领先。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
MAXV = 500

# sieve for smallest prime factor
spf = list(range(MAXV + 1))
for i in range(2, MAXV + 1):
    if spf[i] == i:
        for j in range(i * i, MAXV + 1, i):
            if spf[j] == j:
                spf[j] = i

def factor(x):
    res = {}
    while x > 1:
        p = spf[x]
        cnt = 0
        while x % p == 0:
            x //= p
            cnt += 1
        res[p] = cnt
    return res

n, m = map(int, input().split())
A = list(map(int, input().split()))
B = list(map(int, input().split()))

maxB = {}
for b in B:
    f = factor(b)
    for p, c in f.items():
        maxB[p] = max(maxB.get(p, 0), c)

maxA_full = {}
for a in A:
    f = factor(a)
    for p, c in f.items():
        maxA_full[p] = max(maxA_full.get(p, 0), c)

# check if Alice is already doomed
alice_wins_somewhere = False
for p, v in maxA_full.items():
    if v > maxB.get(p, 0):
        alice_wins_somewhere = True
        break

if not alice_wins_somewhere:
    print(0)
    sys.exit()

maxB_default = lambda p: maxB.get(p, 0)

safe = 0
for a in A:
    f = factor(a)
    ok = True
    for p, c in f.items():
        if c > maxB_default(p):
            ok = False
            break
    if ok:
        safe += 1

ans = (pow(2, n, MOD) - pow(2, safe, MOD)) % MOD
print(ans)
```该实现依赖于最小的素因子筛来快速分解每个数字。 这是必要的，因为重复试除在这里仍然足够快，但结构较差且更难以推理。 

我们计算 Bob 的每个素数最大值一次，并将它们视为固定阈值。 那么每个元素$A$通过将其素数指数与这些阈值进行比较，将其分类为安全或不安全。 最终的组合减法直接来自对子集的计数。 

一个微妙的实现细节是当爱丽丝即使在整套中也没有获胜素数时提前退出。 在这种情况下，没有子集可以改变结果，因此问题陈述需要返回零。 

## 工作示例

 ### 示例 1

 输入：```
2 3
2 6
6 7 8
```我们计算 Bob 的最大值：$6 = 2 \cdot 3$,$7$,$8 = 2^3$。 所以$maxB[2]=3$,$maxB[3]=1$,$maxB[7]=1$。 

对于爱丽丝来说，$2$给出$2^1$,$6$给出$2^1 \cdot 3^1$， 所以$maxA[2]=1$,$maxA[3]=1$。 爱丽丝在任何巅峰时期都没有超过鲍勃，所以她已经占据了主导地位。 该算法输出 0。 

这证明了提前终止的情况。 

### 示例 2

 考虑：```
2 2
4 9
2 3
```鲍勃有$2^1$和$3^1$， 所以$maxB[2]=1$,$maxB[3]=1$。 爱丽丝有$4=2^2$,$9=3^2$，所以她在两个坐标中都赢得了素数。 

安全元素是那些不超过鲍勃最大值的元素。 4 和 9 都不安全，所以$k=0$。 总子集为 4，无效子集为 1（空集），所以答案为 3。 

这显示了如何纯粹通过元素分类来计算子集。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(( | A |
 | 空间|$O(V)$| 最小质因数和指数图的存储 |

 约束将这两组元素限制为 500 个元素，值最多为 500，因此分解和每个元素扫描仍然在限制范围内。 该解决方案通过将游戏减少到每个素数最大值来避免任何组合爆炸。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from math import prod

    MOD = 10**9 + 7
    MAXV = 500
    spf = list(range(MAXV + 1))
    for i in range(2, MAXV + 1):
        if spf[i] == i:
            for j in range(i * i, MAXV + 1, i):
                if spf[j] == j:
                    spf[j] = i

    def factor(x):
        res = {}
        while x > 1:
            p = spf[x]
            c = 0
            while x % p == 0:
                x //= p
                c += 1
            res[p] = c
        return res

    n, m = map(int, input().split())
    A = list(map(int, input().split()))
    B = list(map(int, input().split()))

    maxB = {}
    for b in B:
        f = factor(b)
        for p, c in f.items():
            maxB[p] = max(maxB.get(p, 0), c)

    maxA = {}
    for a in A:
        f = factor(a)
        for p, c in f.items():
            maxA[p] = max(maxA.get(p, 0), c)

    if all(maxA.get(p, 0) <= maxB.get(p, 0) for p in maxA):
        return "0"

    safe = 0
    for a in A:
        f = factor(a)
        ok = True
        for p, c in f.items():
            if c > maxB.get(p, 0):
                ok = False
                break
        if ok:
            safe += 1

    return str((pow(2, n, MOD) - pow(2, safe, MOD)) % MOD)

# provided samples
assert run("""2 3
2 6
6 7 8
""") == "0"

# custom cases
assert run("""2 2
4 9
2 3
""") == "3", "both sides small primes"
assert run("""1 1
2
2
""") == "0", "equal powers immediate loss"
assert run("""3 2
2 4 8
2 3
""") == "6", "some safe some unsafe"
assert run("""1 1
4
2
""") == "1", "single element strictly stronger"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 相等的小素数| 3 | 子集减法逻辑 |
 | 平等的启动权力| 0 | 鲍勃立即占据主导地位
 | 混合权力| 6 | 部分安全分类|
 | 单强元素 | 1 | 基本正面案例|

 ## 边缘情况

 当 Alice 在删除之前没有超过 Bob 的素数时，整个集合就已经丢失了。 对于像这样的输入$A = [6]$,$B = [6]$，两者具有相同的指数轮廓。 该算法计算$maxA[p] \le maxB[p]$对于所有素数并立即返回零。 这与以下事实相符：即使没有删除，鲍勃也会立即获胜。 

当每个元素$A$是安全的，答案就变成了$2^{|A|} - 2^{|A|} = 0$。 例如如果所有$a_i$很小并且在每个素数中都由 Bob 主导，每个子集仍然会失败。 安全计数机制正确地捕获了这一点，因为每个元素都通过了安全检查。
