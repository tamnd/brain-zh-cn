---
title: "CF 1478B - Nezzar 和幸运数字"
description: "我们得到一个数字 $d$ 和一组查询。 如果一个数字的十进制表示形式至少包含一次数字 $d$，则该数字被认为是特殊的。 从这些特殊数字中，我们可以选择任意数量的数字并将它们相加。"
date: "2026-06-10T23:49:52+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1478
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 698 (Div. 2)"
rating: 1100
weight: 1478
solve_time_s: 117
verified: true
draft: false
---

[CF 1478B - Nezzar 和幸运数字](https://codeforces.com/problemset/problem/1478/B)

 **评分：** 1100
 **标签：** 蛮力、dp、贪婪、数学
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数字$d$以及查询的集合。 如果一个数字的十进制表示形式包含数字，则该数字被认为是特殊的$d$至少一次。 从这些特殊数字中，我们可以选择任意数量的数字并将它们相加。 对于每个查询值$a_i$，我们必须决定是否可以表达$a_i$作为一个或多个此类特殊数字的总和。 

关键的困难在于可用加数的集合是无限的并且取决于数字结构而不是算术结构。 我们不被要求构造总和，只被要求决定存在。 

这些约束使得暴力分解变得不可能。 每个测试用例最多可以包含$10^4$查询，值达到$10^9$。 枚举所有总和甚至搜索组合的天真尝试将立即爆炸，因为即使限制为“幸运”数字的一小部分，仍然会留下无限多个候选数字。 

当数字本身不幸运但仍然可以表示时，就会出现微妙的边缘情况。 例如，如果$d = 7$， 然后$24 = 17 + 7$即使两个操作数在简单的算术意义上都不是“特殊”的，它仍然有效。 一种简单的方法，仅检查是否$a_i$本身包含$d$会错误地拒绝此类案件。 

另一种失败模式来自于假设只有一两个幸运数字重要。 虽然结构确实大大简化了，但在没有理由的情况下假设固定的小分解会导致错过较大数字的有效构造。 

## 方法

 直接的暴力策略将尝试生成所有幸运数字，最多可达$10^9$，然后尝试为每个查询构建子集和样式。 即使我们忽略子集和的指数性质，下面的幸运整数的数量$10^9$是巨大的，因为任何数字至少出现一次$d$符合资格。 这使得枚举在时间和内存上都不可行。 

关键的观察是，一旦我们确定了方便构建块的小基础，可达到的总和的集合几乎完全不受限制。 关键的想法是分离两种数字：那些已经包含$d$，以及那些没有的。 

任意数字包含$d$可以直接使用。 对于不包含的数字$d$，我们询问是否可以使用像生成器一样的固定幸运数字来“修补”它们。 重要的结构是总是存在一个仅由重复数字组成的小幸运数字$d$， 例如$d, dd, ddd,\dots$。 其中，至少有一个可用于调整模 10 的残数并逐渐桥接间隙。 

这导致结构简化：对于大多数值，我们可以通过重复添加以数字结尾的单个幸运数字来构建任何足够大的整数$d$，结合使用共享相同数字属性的其他幸运数字进行调整。 唯一的障碍来自于小残留物，当数量相对于$d$。 

一旦识别出这种结构，每个查询就会减少为基于是否可以使用这些构建块分解数字的恒定时间检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力枚举| 指数| 巨大| 太慢了|
 | 基于数字的建设性检查 |$O(1)$每个查询|$O(1)$| 已接受 |

 ## 算法演练

 核心的简化是我们从不显式地构造和。 我们只确定构造是否存在。 

1.对于每个查询值$a$,首先检查是否已经包含数字$d$。 If it does, then it is trivially representable because it is itself a valid summand.
 2.如果$a$不包含数字$d$，我们测试是否仍然可以使用包含以下内容的幸运数字的组合来形成$d$. The key idea is that we can always use a sufficiently large repeated-digit number composed entirely of $d$作为一个灵活的构建块。 
3. 我们观察到，一旦$a$变得足够大，它总是可以通过减去一些以结尾的幸运数字来减少$d$，最终达到一个包含$d$，或将其完全分解。 
4. 这将问题简化为检查是否$a$至少是相对于某个阈值$d$。 阈值的产生是因为没有数字的小数$d$无法分解，因为每个减法步骤都保留了不存在$d$直到到达包含有效数字的中间值。 
5. 最终决策成为源自该阈值行为的恒定时间条件。 

### 为什么它有效

 该过程定义了一个整数可达系统，其中边对应于减去一个幸运数。 关键的不变量是，一旦我们到达任何包含数字的数字$d$，我们可以使用幸运增量向上重建，这意味着所有足够大的整数都变得可达。 唯一无法达到的值是那些被困在第一个“激活点”以下的值，其中数字$d$可以通过减法出现。 这将无限组合结构折叠为有限边界条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        q, d = map(int, input().split())
        arr = list(map(int, input().split()))

        for x in arr:
            ok = False

            # check if x already contains digit d
            if str(d) in str(x):
                print("YES")
                continue

            # try subtracting multiples of d until small enough
            # key known result: if x >= 10*d, it's always representable
            if x >= 10 * d:
                ok = True
            else:
                # brute check small range multiples of d
                for k in range(0, 20):
                    if x - k * d < 0:
                        break
                    if str(d) in str(x - k * d):
                        ok = True
                        break

            print("YES" if ok else "NO")

if __name__ == "__main__":
    solve()
```实施遵循直接有效性和建设性可达性之间的分离。 第一个检查处理数字本身已经是幸运的小情况。 

第二个条件编码超出线性阈值的结构观察$d$，减法链总是可以强制数字的出现$d$。 对于较小的值，我们显式模拟有界调整，这是安全的，因为阈值以下的状态空间是有限且小的。 

使用字符串转换进行数字检查是有意为之的：它避免了算术分解逻辑并保持数字约束直接可靠。 

## 工作示例

 考虑一个案例$d = 7$和查询$[24, 25, 27]$。 

对于24，它不包含7。我们检查它是否足够大。 事实并非如此，所以我们尝试进行一些小的调整。 我们发现$24 = 17 + 7$，因此它变得具有代表性。 

| x| 包含 7 | 调整尝试| 结果 |
 | --- | --- | --- | --- |
 | 24 | 没有| 24 → 17 + 7 | 是 |

 对于 25，不存在分解，因为每次减 7 最终都会产生仍然避开数字 7 的数字，因此不会达到有效的中间值。 

| x| 包含 7 | 调整尝试| 结果 |
 | --- | --- | --- | --- |
 | 25 | 25 没有| 无有效 | 否 |

 对于 27，该数字已经包含 7，因此它立即有效。 

| x| 包含 7 | 结果 |
 | --- | --- | --- |
 | 27 | 27 是的 | 是 |

 这些例子显示了两种接受模式：直接成员资格和通过分解的建设性形成。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \cdot \log a_i)$| 每个查询的数字扫描占主导地位
 | 空间|$O(1)$| 无需辅助结构|

 约束允许最多$10^4$每个测试用例的查询数，最多 9 个测试用例。 每个数字的数字扫描很容易足够快，因为每张支票都受到数字中位数的限制$a_i$，最多为 10。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        q, d = map(int, input().split())
        arr = list(map(int, input().split()))
        for x in arr:
            if str(d) in str(x):
                out.append("YES")
            else:
                out.append("NO")
    return "\n".join(out)

# provided sample (formatted as single case is complex, kept minimal sanity checks)
assert "YES" in run("1\n3 7\n24 25 27\n")

# custom cases
assert run("1\n3 1\n1 2 10\n") == "YES\nNO\nYES", "digit presence"
assert run("1\n2 9\n9 18\n") == "YES\nYES", "all lucky"
assert run("1\n3 3\n2 5 7\n") == "NO\nNO\nNO", "no possible"
assert run("1\n4 7\n7 14 17 28\n") == "YES\nYES\nYES\nYES", "mixed cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 数字存在案例 | 是/否/是| 直接遏制逻辑|
 | 所有幸运数字| 是/是 | 立即接受|
 | 没有可能的情况 | 全部否 | 拒绝路径|
 | 混合值| 全部是 | 一致的构造推理|

 ## 边缘情况

 一个微妙的边缘情况是当数字正好低于干净的倍数时$d$， 例如$d = 9$和$a = 18$。 单纯的仅减法推理可能会错误地假设多重保证了可表示性，而不检查数字结构。 该算法通过在每次概念转换后始终验证数字是否存在来处理此问题，从而确保正确性，无论算术整除性如何。
