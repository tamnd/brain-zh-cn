---
title: "CF 102875H - 快乐摩尔斯电码"
description: "该问题描述了一个类似莫尔斯密码的小密码。 密码书包含多个字母，每个字母都分配有一个长度最多为 5 的唯一二进制字符串。"
date: "2026-07-25T12:59:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102875
codeforces_index: "H"
codeforces_contest_name: "2020 Jiangsu Collegiate Programming Contest"
rating: 0
weight: 102875
solve_time_s: 42
verified: true
draft: false
---

[CF 102875H - 快乐莫尔斯电码](https://codeforces.com/problemset/problem/102875/H)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题描述了一个类似莫尔斯密码的小密码。 密码书包含多个字母，每个字母都分配有一个长度最多为 5 的唯一二进制字符串。 该消息是另一个二进制字符串，我们需要确定可以将消息拆分为给定的字母代码有多少种不同的方式。 根据该数字，答案是三种状态之一：不存在解释、仅存在一种解释或存在多种解释。 在多重情况下，解释的数量必须以 128 为模打印。 

输入由多个测试用例组成。 每个测试用例都会给出编码消息的长度、可用字母的数量、字母到二进制字符串映射的字典以及需要解码的最终二进制字符串。 输出不需要实际的解码文本。 它只询问可能的解码数量。 

重要的约束决定了解决方案。 消息长度可以达到$10^5$，字典最多包含 26 个代码，每个代码的长度最多为 5。尝试每种可能的分割的解决方案具有指数增长，因为每个位置可能是也可能不是分割点。 即使是比较每个位置的每个代码的动态程序也只需要大约$26 \times 5 \times n$操作，这是很容易实现的。 

棘手的部分是，仅在多解决方案的情况下，答案计数才会以 128 为模。 一个常见的错误是只存储模 128 的计数并用它来决定是否存在一个解决方案。 例如，如果实际解码次数为128，则存储的值为0，但答案仍然是“puppymousecat”，而不是“nonono”。 

当字符串只有一种解释时，就会出现另一种边缘情况。 对于输入：```
1
1 1
A 0
0
```正确的输出是：```
happymorsecode
```如果粗心的实现仅在取模后检查计数是否为非零，那么在许多解释对模 128 崩溃为零的情况下将会失败。 

第二种边缘情况是根本无法拆分的消息。 对于输入：```
1
1 1
A 0
1
```正确的输出是：```
nonono
```基于转换的 DP 如果忘记将空前缀初始化为一种有效方式，则会错误地报告没有状态可达。 

## 方法

 蛮力方法是递归地尝试每个可能的下一个字母。 在每个位置，我们都会查看所有字典条目，并在代码与剩余后缀匹配时继续。 这是正确的，因为每个有效的解码都恰好对应于该递归中的一个选择序列。 然而，可能的分割位置的数量可以是指数级的。 一个长度的字符串$n$最多可以有$2^{n-1}$在考虑字典之前放置分隔符的方法有多种，因此这种方法很快就变得不可能。 

暴力法失败是因为它重复解决相同的后缀问题。 如果前几个字母以不同的方式解码，但都到达相同的剩余位置，则其余的工作是相同的。 关键的观察是只有字符串中的当前位置很重要。 过去的选择不会影响未来的可能性，因此该问题具有前缀动态程序的结构。 

我们让状态代表前缀的所有解码。 对于每个可到达的位置，我们尝试每个代码字，并在下一个字符匹配时扩展前缀。 由于码字很短，每个位置只有恒定的工作量。 

第二个观察是关于计数。 我们需要两条信息：计数模 128 以及真实计数是否至少达到 2。 仅保留模值会丢失信息，因为 128、256 和许多更大的计数都会变为零。 单独维护这两个属性足以区分所需的三个输出。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳| O(26 * 5 * n) | O(n) | 已接受 |

 ## 算法演练

 1. 存储密码书中的所有摩尔斯电码字符串。 我们只需要代码本身，因为输出取决于可能解释的数量，而不取决于所选的字母。 
2. 为前缀创建动态编程数组。 对于每个位置，存储到达该位置的方式数模 128 以及指示到达该位置的实际方式数是否至少为 2 的布尔值。 
3. 将空前缀初始化为一种有效解码。 空字符串表示选择任何字母之前的起点。 
4. 从左到右处理每个位置。 如果可以到达某个位置，请尝试字典中的每个代码。 当代码匹配从此位置开始的子字符串时，将当前位置的方式添加到目标位置。 
5. 更新目的地时，正常更新模计数，但独立更新倍数标志。 如果目的地已经有一条路并且有一条新路到达，或者如果源位置已经代表多条路，则多重标志变为真。 
6. 处理完整个字符串后，检查最终位置。 如果没有办法，打印`nonono`。 如果只有一种方法，则打印`happymorsecode`。 否则打印`puppymousecat`以及模 128 的路数。 

其工作原理：前缀的每次解码都恰好在一个位置结束，并且每个有效的下一个字母恰好创建一次到后面前缀的转换。 DP 考虑每个可能的转换，并且仅组合代表有效的先前分割的状态。 不变的是处理后的位置$i$，每个以结尾的前缀的存储信息$i$准确地表示该前缀的所有可能的解码。 由于最终位置包含整个字符串的所有完整解码，因此最终状态给出了所需的分类。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case():
    n, m = map(int, input().split())
    codes = []
    for _ in range(m):
        _, t = input().split()
        codes.append(t)
    s = input().strip()

    mod = [0] * (n + 1)
    many = [False] * (n + 1)

    mod[0] = 1

    def positive(i):
        return mod[i] != 0 or many[i]

    for i in range(n):
        if not positive(i):
            continue
        for c in codes:
            j = i + len(c)
            if j <= n and s.startswith(c, i):
                if positive(j):
                    if positive(i):
                        many[j] = True
                if many[i]:
                    many[j] = True
                mod[j] = (mod[j] + mod[i]) % 128

    if not positive(n):
        return "nonono"
    if not many[n] and mod[n] == 1:
        return "happymorsecode"
    return f"puppymousecat {mod[n]}"

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        ans.append(solve_case())
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```该代码保留两条平行的信息。 这`mod`数组存储应用所需的模运算后的计数。 这`many`数组存储无法从模计数中恢复的信息，即真实计数是否已经至少为二。 

辅助函数`positive`检查一个状态是否代表至少一个解码。 一个州可能有`mod[i] == 0`但仍然可以达到，因为它的实际计数可能是 128 或 128 的另一个倍数。这种区别可以防止最常见的错误答案。 

过渡使用`startswith`具有已知的短代码长度。 由于每个代码的长度最多为 5，因此该检查保持恒定时间。 在检查字符串边界之前计算目标索引，以防止无效访问。 

初始化`mod[0] = 1`表示读取任何字符之前的单个空解码。 没有它，任何其他状态都无法到达。 

## 工作示例

 考虑：```
1
2 2
A 0
B 00
00
```状态变化是：

 | 职位| 匹配代码| 新职位| 模 128 的方式 | 多个|
 | --- | --- | --- | --- | --- |
 | 0 | 一个 | 1 | 1 | 假 |
 | 0 | 乙| 2 | 1 | 假 |
 | 1 | 一个 | 2 | 2 | 真实|

 最终的立场有两种解释：`B`和`AA`。 模计数为 2 并且倍数标志为 true，因此输出为`puppymousecat 2`。 

此示例说明了为什么仅计算模值是不够的。 它还表明不同的分割位置代表着不同的解释。 

考虑：```
1
1 1
A 1
0
```状态变化是：

 | 职位| 匹配代码| 新职位| 模 128 的方式 | 多个|
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 无 | 仅在开始时 1 | 假 |

 最终位置仍然无法到达，所以答案是`nonono`。 

此示例练习第一个字符不能开始任何摩尔斯电码的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(26 * 5 * n) | 每个位置最多检查26个代码，每个代码的长度最多为5。 
| 空间| O(n) | 两个长度为 n + 1 的数组存储前缀状态。 |

 所有测试用例的总消息长度为$10^5$，因此线性动态规划方法很容易满足限制。 该算法避免了递归深度问题，并且不依赖于可能解释的数量。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        out = io.StringIO()
        sys.stdout = out

        t = int(input())
        ans = []

        for _ in range(t):
            n, m = map(int, input().split())
            codes = []
            for _ in range(m):
                _, x = input().split()
                codes.append(x)
            s = input().strip()

            mod = [0] * (n + 1)
            many = [False] * (n + 1)
            mod[0] = 1

            def positive(i):
                return mod[i] != 0 or many[i]

            for i in range(n):
                if not positive(i):
                    continue
                for c in codes:
                    j = i + len(c)
                    if j <= n and s.startswith(c, i):
                        if positive(j) and positive(i):
                            many[j] = True
                        if many[i]:
                            many[j] = True
                        mod[j] = (mod[j] + mod[i]) % 128

            if not positive(n):
                ans.append("nonono")
            elif not many[n] and mod[n] == 1:
                ans.append("happymorsecode")
            else:
                ans.append(f"puppymousecat {mod[n]}")

        return "\n".join(ans)
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""1
1 1
A 0
0
""") == "happymorsecode", "single decoding"

assert run("""1
2 2
A 0
B 00
00
""") == "puppymousecat 2", "multiple decoding"

assert run("""1
1 1
A 0
1
""") == "nonono", "impossible decoding"

assert run("""1
8 2
A 0
B 00
00000000
""") == "puppymousecat 34", "larger count"

assert run("""1
3 1
A 1
111
""") == "happymorsecode", "repeated single code"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0`仅需一个代码 |`happymorsecode`| 独特的单字母解码|
 |`00`有代码`0`和`00`|`puppymousecat 2`| 多个有效分割 |
 | 没有匹配前缀的字符串 |`nonono`| 无法达到最终状态 |
 | 带有短重叠代码的八个零 |`puppymousecat 34`| 计算多种解释和模处理 |
 | 三个相同的单长代码 |`happymorsecode`| 一个简单的强制转换链 |

 ## 边缘情况

 对于 128 的倍数的计数，该算法仍然有效，因为`many`flag 与模值分开存储信息。 消息的结尾可能是`mod[n] = 0`，但如果`many[n]`确实如此，它仍然被正确分类为具有多种解释。 

对于只有一种可能的分割的消息，每个转换都会贡献相同的路径，而不会引起第二种解释。 最终状态保持`many[n]`假和`mod[n]`等于一，产生`happymorsecode`。 

对于不可能的消息，没有任何转换到达最终位置。 初始的空前缀是唯一可达的状态，因此最终状态保持为空并且算法打印`nonono`。 

对于重叠代码，例如`0`和`00`，可以从不同的先前位置到达相同的结束位置。 当另一种解释到达时，更新规则检测到目的地已经具有一种解释，并将其标记为多种。 这是需要单独的唯一性跟踪的情况。
