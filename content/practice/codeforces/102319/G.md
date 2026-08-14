---
title: "CF 102319G - 乔纳森和杰森在乔林贾利 I"
description: "我们有一个三角形的引脚排列，其中 n 个引脚位于底行，n - 1 个引脚位于其上方的行，依此类推，总共有 [ 1+2+dots+n=frac{n(n+1)}2 ] 个引脚。 球滚动后，球本身唯一可以击倒的球瓶是顶部的球瓶。"
date: "2026-08-13T04:57:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102319
codeforces_index: "G"
codeforces_contest_name: "UBC Summer Contest 2018"
rating: 0
weight: 102319
solve_time_s: 477
verified: true
draft: false
---

[CF 102319G - 乔纳森和杰森在 Jowling Jalley I](https://codeforces.com/problemset/problem/102319/G)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有三角形排列的引脚`n`底排上的引脚，`n - 1`在其上方的行上，依此类推，总共\[
1+2+\dots+n=\frac{n(n+1)}2
\]引脚。 

球滚动后，球本身唯一可以击倒的球瓶是顶部的球瓶。 其他所有被击倒的球瓶必定是由紧邻其前面的球瓶造成的。 仅当前一行支撑该销钉的两个销钉已经掉落时，该销钉才能掉落，这对两侧的销钉具有自然的边界解释。 

我们的任务不是找到一种特定的最终安排。 我们需要计算一卷后可能发生的每一种不同的排列。 

The input contains the side length`n`， 在哪里`4 <= n <= 20`。 最大的三角形仅包含 210 个引脚，因此存储一种配置很容易。 困难在于 210 个独立的二元选择已经给出\(2^{210}\)可能的子集，粗略地\(1.6 \times 10^{63}\)。 A direct enumeration is far beyond anything that can run in one second. 的小值`n`is useful only after we find the combinatorial structure of the valid configurations.

 有两种边缘情况很容易被误处理。 为了`n = 4`，答案是`42`， 不是`2^10 = 1024`, because almost all subsets violate the causality rule. The valid configurations are exactly the Catalan objects associated with this triangular dependency structure. 在另一端，`n = 20`有 210 个引脚，但答案仍然适合 64 位整数：\[
C_{21}=24466267020.
\]即使输入本身很小，使用固定宽度 32 位整数的粗心实现也会在此输入上溢出。 Python 的任意精度整数避免了这个问题。 

## 方法

 直接的解决方案将枚举 210 个引脚位置的每个子集。 对于每个子集，我们将检查每个被击倒的引脚并验证其所需的前辈是否也被击倒。 这是正确的，因为每个物理上可能的结果只是一个有效的子集，并且检查前驱条件与规则完全匹配。 

问题是子集的数量。 对于 \(N=\frac{n(n+1)}2\) 个引脚，暴力破解大约需要\(2^N\)配置检查，甚至每个配置的恒定时间检查也是没有希望的。 最大时`n = 20`， 这是\(2^{210}\)， 大约\(1.64\times10^{63}\)配置。 为每个配置添加\(O(N)\)验证会使该方法变得更糟。 

关键的观察结果是，有效的击倒集比任意子集具有更强的结构。 如果某个引脚掉落，则依赖链上位于该引脚上方的每个引脚也必须掉落。 换句话说，落下的引脚形成三角相关偏序集的理想阶。 这样的理想完全由它的边界来描述。 

如果我们绘制将倒下的针与直立的针分开的边界，则该边界可以被编码为单调路径。 依赖条件防止路径跨越自身或离开三角形区域，并且在两端进行通常的填充后，这些边界正是半长的 Dyck 路径`n + 1`。 

半长戴克路径的数量`m`是`m`-th 加泰罗尼亚数字，\[
C_m=\frac{1}{m+1}\binom{2m}{m}.
\]这里`m = n + 1`，所以所需的答案是\[
\boxed{C_{n+1}
=\frac{1}{n+2}\binom{2n+2}{n+1}}.
\]暴力破解之所以有效，是因为它会考虑所有可能的状态并拒绝无效的状态，但会失败，因为状态空间的引脚数量呈指数级增长。 The boundary observation collapses all those states into a standard Catalan family, reducing the computation to a short arithmetic loop.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力 | \(O(n^2 2^{n(n+1)/2})\) | \(O(n^2)\) | 太慢了|
 | 加泰罗尼亚公式 | \(O(n)\) | \(O(1)\) | 已接受 |

 ## 算法演练

 1. 让`m = n + 1`。 有效的引脚配置与 Dyck 路径一一对应`m`打开步骤和`m`关闭步骤。 额外的一份在`n + 1`来自三角形边界的两侧以及顶部依赖性，因此引脚边界由半长比边长大一的 Dyck 路径表示。 

2. 计算加泰罗尼亚数\[
   C_m=\frac{1}{m+1}\binom{2m}{m}.
   \]我们可以用阶乘计算二项式系数，但乘法递推更简单，并且避免构造大的中间阶乘。 

3. 开始于`C_0 = 1`并使用\[
   C_k=C_{k-1}\frac{2(2k-1)}{k+1}.
   \]每个除法都是精确的，因为这是加泰罗尼亚数字的标准整数递归。 

4. 继续直到`k = n + 1`，然后打印`C_{n+1}`。 

### 为什么它有效

 每个有效的配置都具有这样的属性：掉落的销钉会迫使其所有前身销钉掉落。 因此，下降区域不能具有任意形状。 其边界通过三角形排列单调移动，依赖条件正是相应的边界路径永不穿过禁止对角线的条件。 因此，每个有效的引脚配置都会给出一个 Dyck 路径，并且每个这样的 Dyck 路径都会重建一个有效的配置。 自戴克半长路径以来`n + 1`被计算为\(C_{n+1}\)，算法准确返回物理上可能的最终位置的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    m = n + 1

    # Catalan number C_m.
    cat = 1
    for k in range(1, m + 1):
        cat = cat * 2 * (2 * k - 1) // (k + 1)

    print(cat)

if __name__ == "__main__":
    solve()
```输入由单个整数组成，因此`solve`直接读取它。 环境`m = n + 1`将销钉三角形的几何形状转换为相应的 Catalan 索引。 

变量`cat`存储当前的加泰罗尼亚号码。 最初它代表\(C_0=1\)。 迭代时`k`，递归将其转化为\(C_k\)。 乘法在除法之前进行，Python的整数具有任意精度，因此不存在溢出风险。 

循环结束于`n + 1`，完全匹配组合对应所需的索引。 没有数组，也没有递归，因此实现时使用常量辅助空间。 

## 工作示例

 该声明提供了一个样本，`n = 4`。 由于提供的声明中没有第二个官方样本，因此第二个跟踪使用`n = 5`。 

为了`n = 4`，我们需要\(C_5\)。 

|`k`| 当前加泰罗尼亚语值 |
 |---:|---:|
 | 0 | 1 |
 | 1 | 1 |
 | 2 | 2 |
 | 3 | 5 |
 | 4 | 14 | 14
 | 5 | 42 | 42

 最终值为`42`，与官方样品相符。 迹线显示这十个引脚没有导致\(2^{10}\)任意国家。 依赖规则将它们减少到第五个加泰罗尼亚数字。 

为了`n = 5`，我们需要\(C_6\)。 

|`k`| 当前加泰罗尼亚语值 |
 |---:|---:|
 | 0 | 1 |
 | 1 | 1 |
 | 2 | 2 |
 | 3 | 5 |
 | 4 | 14 | 14
 | 5 | 42 | 42
 | 6 | 132 | 132

 输出是`132`。 这与每个有效输入使用的循环相同，因此将三角形增加一行只需要一次额外的算术迭代。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |---|---|---|
 | 时间 | \(O(n)\) | 加泰罗尼亚语复发评估为`n + 1`价值观。 |
 | 空间| \(O(1)\) | 仅存储当前的加泰罗尼亚语值和一些整数。 |

 和`n <= 20`，算法仅执行 21 次迭代。 最大的结果是\(C_{21}=24466267020\)，Python 准确表示。 该解决方案远低于一秒的时间限制，并且使用的内存可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_value(n: int) -> str:
    m = n + 1
    cat = 1

    for k in range(1, m + 1):
        cat = cat * 2 * (2 * k - 1) // (k + 1)

    return str(cat)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    n = int(sys.stdin.readline())
    result = solve_value(n)

    sys.stdin = old_stdin
    return result + "\n"

# Provided sample
assert run("4\n") == "42\n", "sample 1"

# Minimum allowed input
assert run("4\n") == "42\n", "minimum n"

# Small consecutive value
assert run("5\n") == "132\n", "Catalan C6"

# Another boundary-style case
assert run("6\n") == "429\n", "Catalan C7"

# Maximum allowed input
assert run("20\n") == "24466267020\n", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---:|---|
 |`4`|`42`| 官方样品和允许的最低限度`n`|
 |`5`|`132`| 正确的转变从`C_n`到`C_{n+1}`|
 |`6`|`429`| 连续加泰罗尼亚语值和重复|
 |`20`|`24466267020`| 最大约束和大整数运算 |

 ## 边缘情况

 对于`n = 4`，三角形只包含十个引脚，这可以使暴力看起来很诱人。 该算法没有枚举那些\(1024\)子集。 它直接计算\(C_5\)，生产`42`。 这种区别很重要，因为大多数任意子集都违反了前驱条件。 

为了`n = 20`，有 210 个引脚，因此枚举配置需要考虑\(2^{210}\)子集。 该算法改为计算\(C_{21}\)通过 21 个重复步骤。 这些值保持准确，结束于`24466267020`。 

索引是最容易犯的算术错误。 使用\(C_n\)会给`14`为了`n = 4`，而正确的结果是`42`。 三角形边界对应于半长戴克路径`n + 1`，所以实现故意设置`m = n + 1`在评估复发之前。 

递归式还需要其分母为`k + 1`。 例如，在`k = 5`,\[
C_5=C_4\frac{2(2\cdot5-1)}{5+1}
=14\cdot\frac{18}{6}
=42.
\]使用`k`相反，尽管所有操作仍然是整数，但会默默地产生错误的值。 该实现完全遵循标准加泰罗尼亚递归，因此处理此边界条件时没有任何特殊情况。 

:::
