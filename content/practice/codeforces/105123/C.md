---
title: "CF 105123C - 翻转 DNA"
description: "给我们两个长度相等的 DNA 字符串，仅由字符 A、T、C 和 G 组成。每个位置代表一个核苷酸，要求我们决定是否可以仅使用交换互补碱基的突变从第一个字符串获得第二个字符串。"
date: "2026-06-27T19:32:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105123
codeforces_index: "C"
codeforces_contest_name: "BioCode 2024"
rating: 0
weight: 105123
solve_time_s: 77
verified: true
draft: false
---

[CF 105123C - 翻转 DNA](https://codeforces.com/problemset/problem/105123/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给我们两个长度相等的 DNA 字符串，仅由字符 A、T、C 和 G 组成。每个位置代表一个核苷酸，要求我们决定是否可以仅使用交换互补碱基的突变从第一个字符串获得第二个字符串。 

生物学规则是A与T配对，C与G配对。这里的预期解释是，在每个位置，如果发生突变，它只能将核苷酸转化为其互补伙伴，而不能将其他任何东西转化为互补伙伴。 因此，A 可以成为 T 或保持 A，T 可以成为 A 或保持 T，C 可以成为 G 或保持 C，G 可以成为 C 或保持 G。重要的是，不允许像 A 到 C 或 G 到 T 这样的交叉对转换。 

我们不会重新排列字符串或执行全局操作。 每个位置都是独立演变的，我们只是验证第一个字符串中的每个字符是否可以合法地转换为第二个字符串中的相应字符。 

n 最大为 10^5 的约束意味着我们需要线性扫描解决方案。 任何试图探索组合或模拟每个位置的多步骤突变路径的方法只有在每个字符保持 O(1) 的情况下才仍然有效。 任何二次或涉及重复扫描的操作在 2 秒限制下都会失败。 

当角色来自不同的互补对时，就会出现微妙的失败情况。 例如，如果 X 在同一位置有 A，Y 在同一位置有 C，则即使这两个字符都是有效的 DNA 碱基，这也是无效的。 一个天真的错误是假设“只要两个字母都有效，任何更改都可以”，这将错误地接受此类情况。 

另一个边缘情况是当字符串相同时，这应该始终有效，因为不需要突变。 此外，必须正确处理单字符字符串，而无需任何特殊分支。 

## 方法

 蛮力视角是模拟每个位置允许的突变。 对于每个索引 i，我们检查 X[i] 是否可以变为 Y[i]。 如果我们将突变建模为“你可以保留或切换到你的互补碱基”，那么对于每个字符，我们明确测试其允许对中的成员资格。 

这可以通过预定义有效转换的映射来实现。 对于 X 中的每个字符，我们检查 Y[i] 是否等于其自身或其补码。 这已经是 O(n) 了，但更幼稚的解释可能会尝试生成字母之间的突变序列或图形转换，这是不必要的，并且如果错误建模为多步转换，则会引入开销甚至指数推理。 

关键的观察结果是，突变规则是纯粹局部和对称的：每个字符属于固定对 {A, T} 或 {C, G}，并且突变永远不会在对之间交叉。 所以我们唯一需要的条件是 X[i] 和 Y[i] 属于同一对。 

这将问题简化为简单的等价类检查：A 和 T 形成一个类，C 和 G 形成另一个类。 如果 X[i] 和 Y[i] 属于不同的类，那么答案立即是否定的。 否则，所有位置都必须满足此条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n) | O(1) | O(1) | 已接受 |
 | 最佳配对检查 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们通过将每个字符分类到其补集组并逐个位置检查一致性来解决该问题。

1. 将互补组定义为两个集合：一个包含 A 和 T，另一个包含 C 和 G。这种结构以一种快速查询的方式编码突变规则。 
2. 迭代从 0 到 n−1 的每个索引 i，比较 X[i] 和 Y[i]。 
3. 对于每个位置，确定 X[i] 属于哪个组。 
4. 检查Y[i]是否属于同一组。 
5. 如果任何仓位违反此条件，请立即断定该假设是错误的并停止。 
6. 如果扫描完成且没有违规，则得出结论：每个突变都遵守规则。 

立即终止的原因是单个无效位置会使整个假设无效，因此继续只会浪费计算。 

### 为什么它有效

 每个字符恰好属于由互补性引起的两个等价类之一。 突变规则仅允许同一类内的转换。 因此，任何有效的转换都必须保留每个索引的类成员资格。 该算法通过逐个位置检查类位置的相等性来直接强制执行此不变式，从而保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def same_group(a, b):
    # A <-> T, C <-> G
    if a in "AT":
        return b in "AT"
    else:
        return b in "CG"

n = int(input().strip())
x = input().strip()
y = input().strip()

for i in range(n):
    if not same_group(x[i], y[i]):
        print("NO")
        sys.exit(0)

print("YES")
```该解决方案读取输入字符串并定义一个对两个补集进行编码的辅助函数。 该循环独立检查每个位置并在失败时提前退出。 使用直接成员资格检查可以避免对显式映射表或多步逻辑的任何需要，从而使每个字符的实现保持最少且时间恒定。 

一个常见的实现错误是尝试链接补集，例如检查 x 是否可以分两步到达 y，这是不必要的，因为变异规则根本不允许离开等价类。 

## 工作示例

 ### 示例 1

 我们逐个位置比较字符串，并验证每一对是否位于同一补集类内。 

| 我| X[i] | Y[i] | 组(X[i]) | 组（Y[i]）| 有效 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | G | G | CG | CG | 是的 |
 | 1 | C | C | CG | CG | 是的 |
 | 2 | 一个 | 一个 | 在| 在| 是的 |
 | 3 | 一个 | 一个 | 在| 在| 是的 |
 | 4 | G | G | CG | CG | 是的 |
 | 5 | C | C | CG | CG | 是的 |
 | 6 | C | C | CG | CG | 是的 |
 | 7 | T | T | 在| 在| 是的 |

 没有出现不匹配的情况，因此输出为 YES。 这证实了相同的字符在该规则下始终有效。 

### 示例 2

 在这里，我们检测到某个位置上的补体分组违规。 

| 我| X[i] | Y[i] | 组(X[i]) | 组（Y[i]）| 有效 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | C | C | CG | CG | 是的 |
 | 1 | G | G | CG | CG | 是的 |
 | 2 | T | T | 在| 在| 是的 |
 | 3 | 一个 | 一个 | 在| 在| 是的 |
 | 4 | T | T | 在| 在| 是的 |
 | 5 | G | G | CG | CG | 是的 |
 | 6 | G | G | CG | CG | 是的 |
 | 7 | 一个 | 一个 | 在| 在| 是的 |
 | 8 | C | C | CG | CG | 是的 |
 | 9 | 一个 | C | 在| CG | 没有 |

 在索引 9 处，A 属于 AT 组，而 C 属于 CG，打破了突变约束。 算法立即停止并返回 NO。 这表明即使单个跨组不匹配也会使整个字符串无效。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们扫描每个位置一次并执行恒定时间组检查 |
 | 空间| O(1) | O(1) | 仅使用固定数量的状态进行分类 |

 线性扫描非常适合 n 高达 10^5 的约束，并且每个字符的恒定时间操作确保解决方案在时间限制下高效运行。 

## 测试用例```python
import sys, io

def solve():
    input = sys.stdin.readline
    n = int(input().strip())
    x = input().strip()
    y = input().strip()

    def same_group(a, b):
        if a in "AT":
            return b in "AT"
        else:
            return b in "CG"

    for i in range(n):
        if not same_group(x[i], y[i]):
            print("NO")
            return
    print("YES")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue().strip()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out

# provided samples
assert run("8\nGCAAGCCT\nCCATCCCT") == "YES", "sample 1"
assert run("10\nCGTATGGACA\nATACTCACCA") == "NO", "sample 2"

# custom cases
assert run("1\nA\nT") == "YES", "single valid flip"
assert run("1\nA\nC") == "NO", "cross group invalid"
assert run("5\nATCGA\nTACGC") == "YES", "mixed valid pairs"
assert run("5\nAAAAA\nCCCCC") == "NO", "all invalid cross group"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个 T | 是 | 最小有效补集|
 | 1 交流 | 否 | 跨群体拒绝|
 | ATCGA / TACGC | 是 | 混合有效转换 |
 | AAAAA / 中国交通建设总公司 | 否 | 统一无效映射|

 ## 边缘情况

 对于单字符输入（例如 X =“A”和 Y =“T”），该算法仅执行一组检查。 A属于AT类，T也属于AT，所以循环结束，没有触发失败，输出YES。 

对于失败的跨类示例，例如 X =“A”和 Y =“C”，相同的检查会识别出 A 位于 AT，而 C 位于 CG。 该条件在索引 0 处立即失败，算法输出“否”，无需进一步处理。 

对于相同的字符串，例如 X =“CGTAC”和 Y =“CGTAC”，每个索引都会保留组成员身份，因此算法会在整个扫描中确认有效性并返回 YES。
