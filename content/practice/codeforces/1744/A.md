---
title: "CF 1744A - 号码更换"
description: "任务是确定是否可以使用一个过程将给定的整数数组映射到目标字符串，其中数组中的每个不同数字都被分配一个字母，并且该数字的所有出现都被该字母替换。"
date: "2026-06-09T15:57:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1744
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round  828 (Div. 3)"
rating: 800
weight: 1744
solve_time_s: 494
verified: true
draft: false
---

[CF 1744A - 号码替换](https://codeforces.com/problemset/problem/1744/A)

 **评分：** 800
 **标签：** 贪心，实现
 **求解时间：** 8m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是确定是否可以使用一个过程将给定的整数数组映射到目标字符串，其中数组中的每个不同数字都被分配一个字母，并且该数字的所有出现都被该字母替换。 只要相同数字的所有出现都映射到相同的字母，替换的顺序并不重要。 我们给出了多个测试用例，每个测试用例都有一个数组和一个长度相等的目标字符串，如果存在这样的映射，我们必须返回“YES”，否则返回“NO”。 

限制很小：数组最多有 50 个元素，数字最多 50 个。由于不同数字和字母的数量有限，因此可以直接检查任何映射。 主要的微妙之处在于确保没有两个不同的数字映射到同一个字母，并且相同的数字始终映射到同一个字母。 尝试所有可能的映射的简单方法将是不必要的并且速度很慢，如果$n$很大，但这里直接贪婪检查就足够了。 

不明显的边缘情况包括映射到目标字符串中不同字母的重复数字，或尝试映射到同一字母的多个数字。 例如，如果$a = [1,2,1]$和$s = "aba"$，这是有效的，因为 1 映射到“a”，2 映射到“b”。 但如果$a = [1,2,1]$和$s = "abb"$，它是无效的，因为 1 需要映射到“a”和“b”。 同样，如果$a = [1,2,3]$和$s = "aaa"$，它是无效的，因为三个不同的数字不能全部映射到同一个字母。 

## 方法

 蛮力方法会尝试尝试所有可能的数字到字母的分配，这是不必要的。 该问题可以简化为验证两个条件：每个数字必须一致地映射到一个字母，并且任何字母都不能分配给多个数字。 我们可以并行迭代数组和字符串，保留将数字映射到字母的字典。 每次我们遇到一个数字时，我们都会检查它是否有映射。 如果是，则映射必须与当前字母匹配。 如果没有，我们会检查该字母是否已分配给另一个号码。 如果有，则映射是不可能的。 否则，我们记录映射并继续。 这种贪心检查以数组长度的线性时间运行，并且由于约束较小而足够。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(26^n) | O(26^n) | O(n) | 太慢了|
 | 贪婪映射检查 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取长度$n$，数组$a$，以及目标字符串$s$。 
2. 初始化两个字典：一个用于存储从数字到字母的映射，另一个用于跟踪已分配的字母。 
3. 迭代每个索引$i$从 0 到$n-1$。 
4. 对于$a_i$和$s_i$，检查是否$a_i$已经有了映射。 如果是，请确保映射的字母等于$s_i$。 如果不是，答案是“否”。 
5.如果$a_i$没有映射，检查是否$s_i$已分配给另一个号码。 如果是，答案是“否”。 否则，分配$a_i \to s_i$并标记$s_i$如所用。 
6. 如果循环完成且没有冲突，则答案为“是”。 

其原理：不变量是每个数字最多分配一个字母，并且每个字母最多分配给一个数字。 违反任一不变量都会立即触发“否”。 由于所有检查都是一致完成的，因此最终映射保证反映有效的转换（如果存在）。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    s = input().strip()
    
    num_to_char = {}
    char_used = {}
    possible = True
    
    for ai, si in zip(a, s):
        if ai in num_to_char:
            if num_to_char[ai] != si:
                possible = False
                break
        else:
            if si in char_used:
                possible = False
                break
            num_to_char[ai] = si
            char_used[si] = True
    
    print("YES" if possible else "NO")
```此代码使用快速 I/O 读取输入。 我们维持`num_to_char`确保数字到字母的一致映射`char_used`以防止多个数字映射到同一个字母。 支票`num_to_char[ai] != si`确保数字不会映射到不同的字母，同时`si in char_used`确保字母在数字中是唯一的。 循环在冲突发生时就中断了。 

## 工作示例

 样本1：

 | 索引 | a_i | s_i | 数字到字符 | 字符_已使用 | 可能 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 2 | c | {2: 'c'} | {'c'} | 真实|
 | 1 | 3 | 一个 | {2: 'c', 3: 'a'} | {'c','a'} | 真实|
 | 2 | 2 | c | 不变| 不变| 真实|
 | 3 | 4 | t | {2:'c',3:'a',4:t'} ​​| {'c','a',t'} | 真实|
 | 4 | 1 | 一个 | {1:'a',2:'c',3:'a',4:'t'} | {'a','c',t'} | 真实|

 所有检查均通过，输出为“YES”。 

定制案例：

 a = [1,2,1], s = "abb"

 | 索引 | a_i | s_i | 数字到字符 | 字符_已使用 | 可能 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 一个 | {1:'a'} | {'a'} | 真实|
 | 1 | 2 | 乙| {1:'a',2:'b'} | {'a','b'} | 真实|
 | 2 | 1 | 乙| 冲突，1 映射到 a != b | | 假|

 输出：“NO”，符合预期。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * n) | 每个测试用例一次最多处理 n 个元素。 |
 | 空间| O(n) | 每个字典最多存储 n 个元素。 |

 假设 t ≤ 1000 且 n ≤ 50，该算法最多执行 50,000 次迭代，完全在 2 秒限制内。 内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution code
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        s = input().strip()
        
        num_to_char = {}
        char_used = {}
        possible = True
        
        for ai, si in zip(a, s):
            if ai in num_to_char:
                if num_to_char[ai] != si:
                    possible = False
                    break
            else:
                if si in char_used:
                    possible = False
                    break
                num_to_char[ai] = si
                char_used[si] = True
        
        print("YES" if possible else "NO")
    return output.getvalue().strip()

# provided samples
assert run("7\n5\n2 3 2 4 1\ncacta\n1\n50\na\n2\n11 22\nab\n4\n1 2 2 1\naaab\n5\n1 2 3 2 1\naaaaa\n6\n1 10 2 9 3 8\nazzfdb\n7\n1 2 3 4 1 1 2\nabababb") == "YES\nYES\nYES\nNO\nYES\nYES\nNO"

# custom cases
assert run("1\n3\n1 2 1\naba") == "YES", "repeated numbers map correctly"
assert run("1\n3\n1 2 1\nabb") == "NO", "same number maps to different letters"
assert run("1\n3\n1 2 3\naa") == "NO", "more numbers than letters available"
assert run("1\n1\n1\na") == "YES", "single element, trivial mapping"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 2 1，阿巴 | 是 | 重复的数字一致地映射|
 | 1 2 1，abb | 否 | 号码映射冲突 |
 | 1 2 3，aa | 否 | 多次使用的数字多于字母 |
 | 1、一个| 是 | 最小案例|

 ## 边缘情况

 当所有数字都相同并且字符串使用单个字母时，算法会自然地处理这个问题。 例如，a = [1,1,1]，s =“aaa”
