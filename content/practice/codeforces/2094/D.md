---
title: "CF 2094D - 东东萨胡尔"
description: "我们得到了预定的鼓击的记录序列，其中每个字符要么是左击，要么是右击。 每次预期的打击不会产生固定的声音长度。"
date: "2026-06-08T05:34:19+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2094
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1017 (Div. 4)"
rating: 1100
weight: 2094
solve_time_s: 66
verified: true
draft: false
---

[CF 2094D - 东东萨胡尔](https://codeforces.com/problemset/problem/2094/D)

 **评分：** 1100
 **标签：** 贪心、字符串、两个指针
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了预定的鼓击的记录序列，其中每个字符要么是左击，要么是右击。 每次预期的打击不会产生固定的声音长度。 相反，在最终录制的声音中，单个击中可能会被听到为一个字符或两个相同的字符。 

因此，原始序列中的每个字符都独立地扩展为一个短块：左侧击中变成一个“L”或两个“L”，右侧击中变成一个“R”或两个“R”。 所有扩展之后，生成的字符串将连接到观察到的声音字符串中。 

任务是决定是否可以根据这些规则从预期序列生成给定的观察字符串。 

约束足够大，以至于所有展开式上的任何二次或回溯方法都是不可行的。 所有测试用例的总长度高达 200000，因此该解决方案必须在总体上以线性时间处理每个字符。 

当尝试逐个字符匹配而不考虑分组时，会出现一个幼稚的陷阱。 例如，如果 p =“LR”且 s =“LLRL”，则贪婪的逐字符检查可能会过早接受部分匹配，并且无法检测到第二组无法完全对齐。 

另一个常见的失败情况是为 p 中的单个字符过度消耗 s 中的字符。 例如，如果 p 有一个“L”，则不可能在 s 中消耗三个连续的“L”，但粗心的指针实现可能无法检测到组之间的边界。 

关键的困难是我们必须尊重分组：p中的每个字符对应于s中长度为1或2的连续块，并且块不能跨不同字符合并。 

## 方法

 一种暴力的想法是处理 p 中的每个字符并分支为两种选择：将其扩展为一个字符或两个字符，然后模拟生成的字符串并与 s 进行比较。 这会产生指数级的可能性，最高可达 2^{|p|}，即使对于中等大小的输入也是不可能的。 

问题的结构建议采用贪婪匹配策略而不是枚举。 由于 p 中的每个字符都会在 s 中产生相同字符的连续块，因此我们可以从左到右扫描两个字符串并匹配组。 

关键的观察结果是 p 和 s 都可以被压缩为相同字符的运行。 p 中的每个游程必须对应于 s 中同一字符的游程，并且 s 中的游程长度必须介于 p 中的游程长度和该游程长度的两倍之间，因为每个字符独立扩展为长度 1 或 2。 

因此，问题简化为按顺序比较游程长度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 游程贪婪匹配| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将字符串 p 和 s 压缩为运行序列，其中每个运行都是一对（字符，长度）。 这是必要的，因为扩展会保留邻接性，因此只有运行边界很重要。 
2. 如果 p 和 s 中的游程次数不同，则立即返回 NO。 每次命中恰好产生一次运行，因此结构中的不匹配无法通过扩展来修复。 
3. 按顺序迭代 p 和 s 中的相应运行。 
4. 对于每对运行，检查字符是否匹配。 如果它们不同，则立即返回 NO，因为扩展永远不会改变字符。 
5. 令 p 中的游程长度为 x，s 中的游程长度为 y。 由于 p 中的每个字符变为 1 或 2 个字符，因此 x 个相同命中的运行的总扩展必须满足 x ≤ y ≤ 2x。 
6. 如果任何运行违反了这个不等式，则返回 NO。 
7. 如果所有运行都满足条件，则返回 YES。 

### 为什么它有效

p 中的每个字符独立扩展但保留顺序，因此最终的字符串正是与 p 的运行一一对应的块的串联。 在每次运行中，每个原始字符贡献 1 或 2 个相同的字符，这意味着运行长度只能在固定间隔内变化，而不会影响相邻的运行。 由于运行无法合并或拆分不同的字符，因此独立验证每个运行既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def compress(s):
    runs = []
    i = 0
    n = len(s)
    while i < n:
        j = i
        while j < n and s[j] == s[i]:
            j += 1
        runs.append((s[i], j - i))
        i = j
    return runs

t = int(input())
for _ in range(t):
    p = input().strip()
    s = input().strip()

    rp = compress(p)
    rs = compress(s)

    if len(rp) != len(rs):
        print("NO")
        continue

    ok = True
    for (cp, lp), (cs, ls) in zip(rp, rs):
        if cp != cs:
            ok = False
            break
        if ls < lp or ls > 2 * lp:
            ok = False
            break

    print("YES" if ok else "NO")
```压缩步骤确保我们只比较有意义的结构而不是单个字符。 每次运行都存储为一个字符及其频率。 

然后，主循环强制执行结构约束：相同的运行模式和有效的扩展边界。 支票`ls < lp or ls > 2 * lp`直接编码每个独立扩展的命中允许的行为。 

## 工作示例

 ### 示例 1

 输入：

 p =“LR”，s =“LLRR”

 | 步骤| 运行| 运行| 检查 |
 | ---| ---| ---| ---|
 | 1 | 长：1 | 长：2 | 1 ≤ 2 ≤ 2 |
 | 2 | 回复：1 | 回复：2 | 1 ≤ 2 ≤ 2 |

 所有运行都匹配，因此输出为 YES。 

这证明了每次点击都最大化扩展的情况。 

### 示例 2

 输入：

 p =“LRLR”，s =“LRLR”

 | 步骤| 运行| 运行| 检查 |
 | ---| ---| ---| ---|
 | 1 | 长：1 | 长：1 | |
 | 2 | 回复：1 | 回复：1 | |
 | 3 | 长：1 | 长：1 | |
 | 4 | 回复：1 | 回复：1 | |

 所有运行都满足约束条件，所以是。 

这显示了最小的扩展，其中每个命中都是单一长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符在压缩期间访问一次，在比较期间访问一次 |
 | 空间| O(n) | 在无法压缩的最坏情况下运行存储 |

 所有测试用例的总输入大小都以 2×10^5 为界，因此线性解决方案可以轻松地满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def compress(s):
        runs = []
        i = 0
        n = len(s)
        while i < n:
            j = i
            while j < n and s[j] == s[i]:
                j += 1
            runs.append((s[i], j - i))
            i = j
        return runs

    t = int(input())
    out = []
    for _ in range(t):
        p = input().strip()
        s = input().strip()

        rp = compress(p)
        rs = compress(s)

        if len(rp) != len(rs):
            out.append("YES" if False else "NO")
            continue

        ok = True
        for (cp, lp), (cs, ls) in zip(rp, rs):
            if cp != cs or ls < lp or ls > 2 * lp:
                ok = False
                break

        out.append("YES" if ok else "NO")

    return "\n".join(out)

# provided samples
assert run("""5
R
RR
LRLR
LRLR
LR
LLLR
LLLLLRL
LLLLRRLL
LLRLRLRRL
LLLRLRRLLRRRL
""") == """YES
YES
NO
NO
YES"""

# custom cases
assert run("""3
L
LL
R
RRR
LR
LRRR
""") == """YES
NO
NO"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | L 与 LL | 是 | 单次运行最大扩展|
 | R 与 RRR | 否 | 无效扩展超过 2× |
 | LR 与 LRRR | 否 | 不匹配的运行结构|

 ## 边缘情况

 一种边缘情况是，当 s 在一次运行中具有额外的重复时，该重复看起来在本地仍然有效，但在全局上破坏了对齐。 例如，p =“LR”且 s =“LLLR”。 压缩产生 p 运行 [(L,1),(R,1)] 和 s 运行 [(L,3),(R,1)]。 第一次运行未满足约束条件，因为 3 > 2 × 1，所以答案是否定的。 该算法在运行比较期间立即捕获这一点。 

另一个边缘情况是当 s 的运行次数少于 p 时，因为根据规则不可能进行跨边界合并。 例如，p =“LRL”且 s =“LLRR”。 压缩给出 p 作为三次运行，但 s 作为两次运行，因此算法立即拒绝。 这确保我们永远不会错误地允许跨字符合并。
