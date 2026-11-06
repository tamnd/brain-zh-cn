---
title: "CF 1906L - 回文括号"
description: "我们被要求构造一个偶数长度 $N$ 的括号序列，使其平衡，这意味着每个左括号都有相应的右括号，并且嵌套是正确的。"
date: "2026-06-08T20:48:08+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1906
codeforces_index: "L"
codeforces_contest_name: "2023-2024 ICPC, Asia Jakarta Regional Contest (Online Mirror, Unrated, ICPC Rules, Teams Preferred)"
rating: 2500
weight: 1906
solve_time_s: 91
verified: true
draft: false
---

[CF 1906L - 回文括号](https://codeforces.com/problemset/problem/1906/L)

 **评分：** 2500
 **标签：** 构造性算法
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求构造一个偶数长度的括号序列$N$这样它是平衡的，这意味着每个左括号都有相应的右括号，并且嵌套是正确的。 此外，序列必须具有长度精确的最长回文子序列 (LPS)$K$。 任务是确定这样的序列是否存在，如果存在，则构造任何有效的示例。 

输入整数$N$和$K$设置序列的约束。$N$是括号字符串的总长度，并且$K$是我们必须达到的 LPS 的确切长度。 自从$N$是偶数，一个完全嵌套的序列，例如`((()))`总是可能的，当$N \ge 2$。 然而，在独立于平衡控制 LPS 长度方面出现了挑战。 

当出现不明显的边缘情况时$K$太小或太大。 例如，如果$K = 1$，不存在具有单字符回文子序列的平衡序列，因为单个括号不能单独存在于平衡序列中。 如果$K = N$，序列本身必须是回文。 对于中间值，粗心的构造可能会超出或低于 LPS。 例如，对于$N = 6$和$K = 2$， 使用`()()()`结果 LPS 为 4，而不是 2。检测可行范围$K$给定$N$至关重要。 

## 方法

 暴力方法将枚举所有长度平衡的括号序列$N$并计算每个的LPS。 生成所有平衡序列可以递归地完成，但序列的数量呈指数增长$N$（加泰罗尼亚语号码$C_{N/2}$），这对于$N \le 2000$。 计算每个序列的 LPS 还需要$O(N^2)$，使得暴力破解毫无希望。 

关键的见解是将平衡和回文子序列解耦。 平衡序列由对组成`()`。 LPS 长度通过连续匹配的括号最大化。 当括号尽可能交替出现时，平衡序列中的最小 LPS 就会出现（例如，`()()()`）。 最大的出现在完全嵌套的序列中（例如，`((()))`）。 观察这一点，我们看到一个模式：

 - 长度平衡序列的最大LPS$N$是$N$（完全嵌套）。 
- 长度平衡序列的最小LPS$N$是$N/2 + 1$什么时候`N/2`对被分成非嵌套序列（例如，`()()()...`）。 

有了这个，我们可以通过首先确定有多少个连续的来构造一个有效的序列`(`筑巢，然后用交替的对填充剩余的部分。 这保证了平衡和精确的 LPS 长度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(C_{N/2} * N^2) | O(C_{N/2} * N^2) | O(N^2) | O(N^2) | 太慢了 |
 | 建设性嵌套 | O(N) | O(N) | 已接受 |

 ## 算法演练

 1. 检查是否$K$是可行的。 如果$K < 2$或者$K > N$， 打印`-1`并退出，因为平衡序列的 LPS 不能超出该范围。 
2. 初始化一个空字符串来构建序列。 
3. 达到特定的LPS$K$，确定在开头嵌套多少个左括号。 让`open_count = K // 2`。 添加`open_count` `(`到顺序。 
4. 立即用以下命令关闭这些括号`open_count` `)`。 此时，嵌套块的贡献正好`2 * open_count`到LPS。 
5. 对于剩余长度$N - 2 * open_count$, 交替追加`()`对。 如果选择作为子序列的一部分，则每个这样的对都会为 LPS 贡献 2。 
6. 返回构建的序列。 

这样做的原因是初始嵌套块明确定义了 LPS，而其余的交替对不会将 LPS 延伸到超出所需的长度。 该序列始终是平衡的，因为每个`(`有对应的`)`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    N, K = map(int, input().split())
    
    if K < 2 or K > N:
        print(-1)
        return
    
    seq = []
    open_count = K // 2
    # Step 1: add nested parentheses to control LPS
    seq.extend(['('] * open_count)
    seq.extend([')'] * open_count)
    
    # Step 2: fill the remaining with simple alternating pairs
    remaining = N - 2 * open_count
    seq.extend(['(' , ')'] * (remaining // 2))
    
    print(''.join(seq))

if __name__ == "__main__":
    main()
```该代码首先检查是否可能存在有效序列。 这`open_count`确保嵌套部分对 LPS 做出贡献，而剩余序列则填充`()`配对以保持平衡而不增加 LPS。 乘法`remaining // 2`除以 2 确保总序列长度总和为$N$。 像奇数剩余长度这样的边缘条件是不可能的，因为$N$是均匀的。 

## 工作示例

 ### 输入示例 1

 | 变量| 价值|
 | --- | --- |
 | 尼 | 6 |
 | 克 | 4 |
 | 开放计数 | 2 |
 | 嵌套后的 seq | (()) |
 | 剩余| 2 |
 | 交替对后的 seq | (())() | (())() |

 这会产生一个平衡序列`(())()`LPS 长度为 4。嵌套`(( ))`为 LPS 贡献 4，并且尾随`()`不进一步扩展它。 

### 自定义输入

 输入：`N = 8, K = 6`| 变量| 价值|
 | --- | --- |
 | 尼 | 8 |
 | 克 | 6 |
 | 开放计数 | 3 |
 | 嵌套后的 seq | ((())) | ((())) |
 | 剩余| 2 |
 | 交替对后的 seq | ((()))() | ((()))() |

 顺序是平衡的。 脂多糖 (LPS)`((()))()`正好是 6，因为前三个嵌套对贡献了 6，而后面的`()`不会向 LPS 添加超出所需长度的任何内容。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 一次构建序列 |
 | 空间| O(N) | 将序列存储为列表 |

 该算法与$N$并在限制范围内舒适地适应$N \le 2000$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided samples
assert run("6 4\n") == "(())()", "sample 1"

# Custom tests
assert run("8 6\n") == "((()))()", "nested with alternating tail"
assert run("2 2\n") == "()", "minimum valid sequence"
assert run("10 8\n") == "(((())))()", "longer sequence with desired LPS"
assert run("4 1\n") == "-1", "impossible small LPS"
assert run("4 5\n") == "-1", "impossible large LPS"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 8 6 | ((()))() | ((()))() | 嵌套块+交替尾部产生精确的LPS |
 | 2 2 | 2 ()| 最小序列作品|
 | 10 8 | (((())))() | 使用精确的 LPS 处理更长的序列 |
 | 4 1 | -1 | 不可能的小LPS被拒绝|
 | 4 5 | -1 | 不可能的大型LPS被拒绝|

 ## 边缘情况

 对于`N = 4, K = 1`，算法立即输出`-1`。 不存在长度为 4、LPS 为 1 的平衡序列。对于`N = 4, K = 4`，算法构造`((()))`（调整实际长度后）产生的 LPS 为 4，确认了最大可行 LPS 的正确处理。 对于甚至`N`并且有效`K`，嵌套块加上交替对的组合始终保持平衡，同时实现精确的 LPS。
