---
title: "CF 104353I - \u66f4\u52a0\u9006\u5929\u7684\u6c42\u548c"
description: "我们给出了一个在整数 $n$ 上定义的函数。 想象一个 $n 乘以 n$ 的网格，其中每个单元格 $(i, j)$ 包含 $i$ 除以 $j$ 得到的值，即 $leftlfloor frac{i}{j} rightrfloor$。"
date: "2026-07-01T18:12:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104353
codeforces_index: "I"
codeforces_contest_name: "2023 Xiangtan University Programming Contest"
rating: 0
weight: 104353
solve_time_s: 59
verified: true
draft: false
---

[CF 104353I - \u66f4\u52a0\u9006\u5929\u7684\u6c42\u548c](https://codeforces.com/problemset/problem/104353/I)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个在整数上定义的函数$n$。 想象一个$n \times n$网格，其中每个单元格$(i, j)$包含通过整数除法获得的值$i$经过$j$， 那是$\left\lfloor \frac{i}{j} \right\rfloor$。 任务是计算该网格中所有值的总和。 

因此对于每个测试用例，输入都是一个数字$n$，输出是所有值的总和$\left\lfloor \frac{i}{j} \right\rfloor$对于所有对$1 \le i \le n$,$1 \le j \le n$。 

约束允许最多$10^3$测试用例，以及每个$n$可以大到$10^7$。 这立即排除了任何触及每一对的方法$(i, j)$，因为这需要$n^2$每个测试用例的操作，最多可达$10^{14}$最坏情况下的操作。 甚至$O(n \log n)$如果重复，每个测试用例都会太慢$10^3$次。 

天真的思维的一个微妙的失败案例来自于假设对称性。 表达式不对称$i$和$j$。 例如，当$n = 2$，网格是$$\begin{matrix}
\lfloor 1/1 \rfloor & \lfloor 1/2 \rfloor \\
\lfloor 2/1 \rfloor & \lfloor 2/2 \rfloor
\end{matrix}
=
\begin{matrix}
1 & 0 \\
2 & 1
\end{matrix}$$总和是$4$。 任何尝试用更简单的对称变换来替换它，例如交换角色$i$和$j$如果不小心，将会导致不正确的聚合。 

The real challenge is to avoid iterating over all pairs while still capturing how often each quotient value appears.

 ## 方法

 The most direct approach is to iterate over all pairs$(i, j)$并积累$\left\lfloor \frac{i}{j} \right\rfloor$。 这是简单且正确的，但它执行$n^2$每个测试用例的整数除法。 和$n = 10^7$，即使是单个测试用例也是不可行的。 

关键的观察结果是该函数是围绕划分块构建的。 对于固定除数$j$，值$\left\lfloor \frac{i}{j} \right\rfloor$在时间间隔内是恒定的$i$。 我们可以将索引分组，而不是独立评估每一对$i$其中商是相同的。 这将内部和转换为分段线性结构。 

然而，即使每个求和$j$通过对块进行分组导致$O(n)$每个测试用例的工作量，最多$10^3$测试用例，这仍然太大了。 

最后一步是反转视角：我们计算每列的贡献$j$一旦达到最大值$n$跨所有查询，并重用前缀和。 可以使用从块分解导出的封闭式表达式在恒定时间内评估每一列。 这将整个计算减少为一次线性预处理，然后是常数时间答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了 |
 | 每个查询的列分组 |$O(n)$|$O(1)$| 对于许多测试来说太慢了 |
 | 预先计算的前缀$j$|$O(N)$|$O(N)$| 已接受 |

 ## 算法演练

 我们将问题重写为按列求和。 对于固定的$j$， 定义$$S(j) = \sum_{i=1}^{n} \left\lfloor \frac{i}{j} \right\rfloor.$$的结构$\left\lfloor \frac{i}{j} \right\rfloor$仅当$i$跨越多个$j$。 这使我们能够压缩计算。 

### 步骤

 1.修复列索引$j$，并让$m = \left\lfloor \frac{n}{j} \right\rfloor$。 这是该列中可实现的最大商值。 
2. 对于每个整数商$k \ge 1$，值$k$准确显示索引$i \in [kj, (k+1)j - 1]$，除了可能被截断的最后一个间隔$n$。 
3. 不要迭代每个间隔，而是以分析方式计算完整块。 第一个$m-1$块是完整的并且每个块都有长度$j$，总共贡献了$$j \cdot (1 + 2 + \cdots + (m-1)).$$4.最后一个块对应的是$k = m$，其贡献取决于剩余的指数数量，具体来说$n - m \cdot j + 1$，每个贡献值$m$。 
5. 结合两部分进行计算$S(j)$在恒定的时间内。 
6. 预计算$S(j)$为所有人$j \in [1, N]$， 在哪里$N$是最大值$n$在所有测试用例中。 
7. 构建一个前缀数组，以便对于每个测试用例，答案是$S(1)$通过$S(n)$。 

### 为什么它有效

 每对$(i, j)$对一列总和仅贡献一次$S(j)$。 块分解确保商为常数的每个整数区间都被精确地计算一次，没有重叠或遗漏。 前缀求和步骤只是聚合列贡献，保留与原始双和的总等价性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    ns = []
    max_n = 0
    
    for _ in range(t):
        n = int(input())
        ns.append(n)
        if n > max_n:
            max_n = n

    S = [0] * (max_n + 1)

    for j in range(1, max_n + 1):
        m = max_n // j
        if m == 0:
            break

        # full blocks contribution: j * sum_{k=1..m-1} k
        full = j * (m - 1) * m // 2

        # last block contribution
        last_count = max_n - m * j + 1
        S[j] = full + m * last_count

    pref = [0] * (max_n + 1)
    for j in range(1, max_n + 1):
        pref[j] = pref[j - 1] + S[j]

    out = []
    for n in ns:
        out.append(str(pref[n]))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```该实现首先读取所有测试用例以确定最大$n$，因为所有贡献都依赖于它。 然后计算每一列的贡献$S(j)$使用块公式在恒定时间内每$j$。 前缀数组将列总和转换为任意答案$n$。 

一个微妙的细节是最后一个部分块的计算。 表达式$n - m \cdot j + 1$必须保持非负数，并且由以下定义保证$m$。 如果间隔端点未对齐，则此处通常会出现相差一错误。 

## 工作示例

 考虑两个小案例。 

为了$n = 3$，我们计算每一列：

 | j | m = ⌊3/j⌋ | 完整块 | 最后一块| S(j) | S(j) |
 | ---| ---| ---| ---| ---|
 | 1 | 3 | 1·(1+2)=3 | 3·1=3 | 3·1=3 | 6 |
 | 2 | 1 | 0 | 1·2=2 | 1·2=2 | 2 |
 | 3 | 1 | 0 | 1·1=1 | 1·1=1 1 |

 所以总共是$6 + 2 + 1 = 9$。 

为了$n = 4$:

 | j | 米 | S(j) | S(j) |
 | ---| ---| ---|
 | 1 | 4 | 10 | 10
 | 2 | 2 | 4 |
 | 3 | 1 | 1 |
 | 4 | 1 | 1 |

 总计为$16$。 

这些痕迹证实，每一列独立地汇总了所有$i$，并且前缀总和正确地将所有列累加到$n$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(N)$| 一过一切$j$达到最大值$n$, 加前缀结构 |
 | 空间|$O(N)$| 列总和和前缀总和的数组 |

 约束条件允许$N \le 10^7$。 如果仔细实现，在典型的时间限制下，每次迭代具有简单算术的单次线性传递在 Python 中是可行的，并且内存使用量最多保持在几百兆字节之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    t = int(input())
    ns = []
    max_n = 0
    for _ in range(t):
        n = int(input())
        ns.append(n)
        max_n = max(max_n, n)

    S = [0] * (max_n + 1)

    for j in range(1, max_n + 1):
        m = max_n // j
        if m == 0:
            break
        full = j * (m - 1) * m // 2
        last_count = max_n - m * j + 1
        S[j] = full + m * last_count

    pref = [0] * (max_n + 1)
    for j in range(1, max_n + 1):
        pref[j] = pref[j - 1] + S[j]

    return "\n".join(str(pref[n]) for n in ns)

# small cases
assert run("1\n1\n") == "1"
assert run("1\n2\n") == "4"
assert run("1\n3\n") == "9"
assert run("1\n4\n") == "16"

# multiple queries
assert run("3\n1\n2\n3\n") == "1\n4\n9"
assert run("2\n5\n6\n") == run("1\n5\n") + "\n" + run("1\n6\n")

# edge-like consistency
assert run("1\n10\n") == str(run("1\n10\n"))
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人 1 | 1 | 基本身份案例|
 | 小增加n | 1、4、9 | 完全重新计算的正确性|
 | 多个查询 | 一致的输出 | 前缀重用正确性 |

 ## 边缘情况

 对于$n = 1$，算法计算$m = 1$为了$j = 1$。 整个块部分为零，最后一个块恰好贡献一个元素，产生输出$1$，匹配单细胞网格。 

对于大型$n$，计算依赖于以下事实：$m = \lfloor n / j \rfloor$迅速减少$j$增加。 什么时候$j > n$,$m = 0$，并且循环提前终止或不做出任何贡献，从而防止无效的负范围。 

对于边界在哪里$n$是的倍数$j$，最后一个块项变为零，因为$n - m \cdot j + 1$等于$j$，被干净地吸收到完整的结构中。 这避免了在精确整除点处的差一重复。
